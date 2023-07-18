const express = require('express');
const auth = require('../controllers/authController');
const verifyUser = require('../middlewares/verifyUser');
const { registrationValidators } = require('../helpers/registrationValidation');
const verifyUserSignupInfo = require('../middlewares/verifyUserSignupInfo');

const routes = express.Router();

routes.post(
  '/signup',
  [
    registrationValidators.namesValidator('firstname'),
    registrationValidators.namesValidator('lastname'),
    registrationValidators.validateEmail('email'),
    registrationValidators.validatePassword('password'),
  ],
  verifyUserSignupInfo,
  auth.signup
);
routes.post('/login', auth.login);
routes.post('/logout', verifyUser, auth.logout);
routes.put('/passwordReset', verifyUser, auth.passwordReset);

module.exports = routes;
