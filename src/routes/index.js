const express = require('express');

const routes = express.Router();

const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const dishRoutes = require('./dishRoutes');
const verifyUser = require('../middlewares/verifyUser');
const chefRoutes = require('./chef');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', verifyUser, roleRoutes);
routes.use('/dish', verifyUser, dishRoutes);
routes.use('/chef', chefRoutes);

module.exports = routes;
