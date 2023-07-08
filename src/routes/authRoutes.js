const express = require('express');
const auth = require('../controllers/authController');
const { validateToken } = require('../jwt.js');
const routes = express.Router();

// checking if the user is authorized as an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'You are not an admin.' });
  }
};

routes.post('/signup', auth.signup); // Route to the signup function
routes.post('/login', auth.login); // Route to the login function
routes.post('/logout', auth.logout); // Route to the logout function
routes.put('/passwordReset', validateToken, auth.passwordReset); // Route to the logout function

// endpoints for testing the authentication and authorization
routes.get('/profile', validateToken, auth.profile);
routes.get('/dashboard', validateToken, isAdmin, auth.dashboard);

module.exports = routes;
