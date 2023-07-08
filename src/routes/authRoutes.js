const express = require('express');
const auth = require('../controllers/authController');
const { validateToken } = require('../jwt');

const routes = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'You are not an admin.' });
  }
};

routes.post('/signup', auth.signup);
routes.post('/login', auth.login);
routes.post('/logout', auth.logout);
routes.put('/passwordReset', validateToken, auth.passwordReset);

routes.get('/profile', validateToken, auth.profile);
routes.get('/dashboard', validateToken, isAdmin, auth.dashboard);

module.exports = routes;
