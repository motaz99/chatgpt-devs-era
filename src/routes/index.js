const express = require('express');

const routes = express.Router();
const authRoutes = require('./auth');
const roleRoutes = require('./role');

routes.use('/auth', authRoutes);
routes.use('/role', roleRoutes);

const dishRoutes = require('./dish');

routes.use('/dish', dishRoutes);

module.exports = routes;
