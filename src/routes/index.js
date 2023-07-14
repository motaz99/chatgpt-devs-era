const express = require('express');

const routes = express.Router();
const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const dishRoutes = require('./dishRoutes');
const orderRoutes = require('./order');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', roleRoutes);
routes.use('/dish', dishRoutes);
routes.use('/orders', orderRoutes);

module.exports = routes;
