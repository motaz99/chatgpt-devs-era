const express = require('express');
const auth = require('../controllers/authController');
const { validateToken } = require('../jwt');

const routes = express.Router();

routes.post('/signup', auth.signup);
routes.post('/login', auth.login);
routes.post('/logout', auth.logout);
routes.put('/passwordReset', validateToken, auth.passwordReset);

module.exports = routes;
