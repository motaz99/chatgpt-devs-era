const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();
const { createTokens } = require('../jwt');

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
    const token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        type: user.type,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '14d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'you logged in successfully try to do subsequent request',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signup = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    // checking if the user exist
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(409).json({ error: 'Email is already registered' });
    }

    // checking if the password valid
    const hashedPassword = await bcrypt.hash(password, 10);

    // saving user information to DB
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      provider: null,
      providerId: null,
      profilePicture: null,
      type: 'normal-user',
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
