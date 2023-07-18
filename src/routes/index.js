const express = require('express');

const routes = express.Router();
const clientRoutes = require('./clientRoutes');
const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const verifyUser = require('../middlewares/verifyUser');
const chefRoutes = require('./chefRoutes');
const orderRoutes = require('./orderRoutes');
const { verifyChef, verifyClient } = require('../middlewares/verfiyRole');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', verifyUser, roleRoutes);
routes.use('/chef', verifyUser, verifyChef, chefRoutes);
routes.use('/clients', verifyUser, verifyClient, clientRoutes);
routes.use('/orders', verifyUser, orderRoutes);

module.exports = routes;
