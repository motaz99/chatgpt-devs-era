const express = require('express');

const routes = express.Router();
const normalAuthRoutes = require('./authRoutes');
const authRoutes = require('./auth');
const roleRoutes = require('./role');
const dishRoutes = require('./dish');

routes.use('/auth', authRoutes);
routes.use('/normalAuth', normalAuthRoutes);
routes.use('/role', roleRoutes);
routes.use('/dish', dishRoutes);

module.exports = routes;
