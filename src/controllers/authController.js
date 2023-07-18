const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../helpers/generateToken');
const decodeJwtToken = require('../helpers/decodeJwtToken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const jwtToken = req.cookies.jwt;
    if (jwtToken) {
      const decodedToken = decodeJwtToken(jwtToken);
      throw new Error(
        `User already logged in using '${decodedToken.email}' email`
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    if (user.role === 'client') {
      res.redirect('/api/clients/chefs');
    }

    if (user.role === 'chef') {
      // No we are just showing a message but later we complete the login flow we should replace this response with chef real info
      res.json({
        message: 'The orders that related to the chef should be show',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const jwtToken = req.cookies.jwt;
    if (jwtToken) {
      const decodedToken = decodeJwtToken(jwtToken);
      throw new Error(
        `User already logged in using '${decodedToken.email}' email`
      );
    }
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('Email is already registered');
    }

    if (!password) {
      throw new Error('Need to set a password');
    }

    // checking if the password valid
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      provider: null,
      providerId: null,
      profilePicture: null,
      password: hashedPassword,
      type: 'normal-user',
      role,
    });
    const token = generateToken(newUser);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message:
        'You have signed up successfully, and now you are a logged in user',
      next: `You now need to fill the ${newUser.role} information`,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie('jwt');
  res.send('Logged out successfully');
};

const passwordReset = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  passwordReset,
};
