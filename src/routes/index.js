const express = require('express');

const routes = express.Router();
const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const verifyUser = require('../middlewares/verifyUser');
const chefRoutes = require('./chefRoutes');
const orderRoutes = require('./orderRoutes');
const dishRoutes = require('./dishRoutes');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', verifyUser, roleRoutes);
routes.use('/chef', verifyUser, chefRoutes);
routes.use('/clients', verifyUser, clientRoutes);
routes.use('/orders', verifyUser, orderRoutes);
routes.use('/dish', verifyUser, dishRoutes); // No need to use "verifyClient", because this should be handled by the forntend.

module.exports = routes;
