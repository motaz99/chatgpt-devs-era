const bcrypt = require('bcrypt');
const { User } = require('../models/auth');
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

    const accessToken = createTokens(user);

    res.cookie('jwt', accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });
    req.user = user;

    res.json('logged in');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('jwt');
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// endpoint to check if user is authorized or not
const profile = (req, res) => {
  res.json('profile');
};

const dashboard = (req, res) => {
  res.json('dashboard');
};

module.exports = {
  signup,
  login,
  logout,
  profile,
  dashboard,
  passwordReset,
};
