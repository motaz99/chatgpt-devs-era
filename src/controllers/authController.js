const bcrypt = require('bcrypt');
const { User } = require('../models/auth');
require('dotenv').config();
const { createTokens } = require('../jwt.js'); 

const login = async (req, res) => {
  
  const { email, password } = req.body;

  try {

    // checking if the user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // checking if the password valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid  email or password' });
    }

    // create JWT access token
    const accessToken = createTokens(user);

    // save the JWT token to the cookies
    res.cookie('access-token', accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
    });

    // saving user information for middlewares 
    req.user = user;

    res.json('logged in');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signup = async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // checking if the user exist
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // checking if the password valid
    const hashedPassword = await bcrypt.hash(password, 10);

    // saving user information to DB
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
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

    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // incrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Set the new password
    user.password = hashedPassword;

    // Save the updated user in the database
    await user.save();

    // Password reset successful
    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// endpoint to check if user is authorized or not
const profile = (req, res) => {
  console.log(req.userId);
  res.json('profile');
};

// endpoint to check if user is authorized or not
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
