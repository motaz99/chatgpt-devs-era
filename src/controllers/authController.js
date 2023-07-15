const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../helpers/generateToken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid  email or password' });
    }

    const token = generateToken(user);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'you logged in successfully try to do subsequent request',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
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
      password: hashedPassword,
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

// logout
const logout = async (req, res) => {
  res.clearCookie('access-token');
  res.send('Cookie deleted successfully');
};

const passwordReset = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  passwordReset,
};
