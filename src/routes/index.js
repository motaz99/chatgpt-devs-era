const express = require('express');

const routes = express.Router();
const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const verifyUser = require('../middlewares/verifyUser');
const chefRoutes = require('./chefRoutes');
const orderRoutes = require('./order');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', verifyUser, roleRoutes);
routes.use('/chef', chefRoutes);
routes.use('/clients', clientRoutes);
routes.use('/orders', orderRoutes);

module.exports = routes;
