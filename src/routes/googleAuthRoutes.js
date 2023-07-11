const express = require('express');

const routes = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Will use this when we create the token
const User = require('../models/GoogleUser');

routes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const { user } = req;

    try {
      const currentUser = await User.findOne({
        providerId: user.providerId,
      });

      if (currentUser) {
        /* We need to create the token and push inside the cookie at this point because the user logged in
           but for now will keep it as comment because we don't have front-end the cookie or the session will
           hold us back at this point
        */

        // We need to send him directly to his dashboard page
        if (currentUser.role === 'chef') {
          // we will redirect him to the chef dashboard page which is I think the order page
          res.json({
            message:
              'Here we have to have the chef dashboard page instead of this message',
          });
        }

        if (currentUser.role === 'client') {
          // we will redirect him to the chef dashboard page which is I think the order page
          res.json({
            message:
              'Here we have to have the client dashboard page instead of this message',
          });
        }

        if (currentUser.role === 'user') {
          // we will redirect him to the chef dashboard page which is I think the order page
          res.json({
            message: 'Here we have to redirect the user to decide his role',
          });
        }
      }

      const newUser = await User.create({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        provider: user.provider,
        providerId: user.providerId,
        profilePicture: user.providerPicture,
      });
      /* We need to create the token and push inside the cookie at this point because the user logged in
           but for now will keep it as comment because we don't have front-end the cookie or the session will
           hold us back at this point
      */

      // After we create the user we need to send him to decide his role
      res.json({
        message: 'Here we have to redirect the user to decide his role',
        newUser,
      });
    } catch (error) {
      console.log(error);
    }

    res.end();
  }
);

routes.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.end();
});

module.exports = routes;
