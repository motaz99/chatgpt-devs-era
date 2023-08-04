const express = require('express');

const routes = express.Router();
const passport = require('passport');
const {
  googleCallback,
  logout,
} = require('../controllers/authGoogleController');

routes.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

routes.get('/logout', logout);

module.exports = routes;
