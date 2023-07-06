const express = require('express');

const routes = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    console.log(user);

    try {
      let currentUser = await User.findOne({
        providerId: user.providerId,
      });

      if (currentUser) {
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
      }

      if (!currentUser) {
        const newUser = await User.create({
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          provider: user.provider,
          providerId: user.providerId,
          profilePicture: user.providerPicture,
        });
        currentUser = newUser;
      }

      res.json(currentUser);
    } catch (error) {
      console.log(error);
    }

    // I need to create the token depending on what I need

    // const token = jwt.sign(
    //   {
    //     name: user.name,
    //     email: user.email,
    //     providerId: `google-${user.providerId}`,
    //     avatar: user.profilePicture,
    //   },
    //   process.env.SECRET_KEY,
    //   { expiresIn: '14d' }
    // );

    // I need to specify the configuration for the cookie as well

    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 14 * 24 * 60 * 60 * 1000,
    // });

    // res.redirect('/');
    console.log('This the /google/callback route');
    res.end();
  }
);

routes.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.end();
});

module.exports = routes;
