/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/googleAuth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userGoogleDetails = {
          email: profile._json.email,
          firstname: profile._json.given_name,
          lastname: profile._json.family_name,
          provider: profile.provider,
          providerId: profile._json.sub,
          providerPicture: profile._json.picture,
        };
        done(null, userGoogleDetails);
      } catch (error) {
        console.log(error);
      }
    }
  )
);
