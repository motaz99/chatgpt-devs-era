const express = require('express');

const routes = express.Router();
const authRoutes = require('./authRoutes');
const googleAuthRoutes = require('./googleAuthRoutes');
const roleRoutes = require('./roleRoutes');
const dishRoutes = require('./dishRoutes');
const verifyUser = require('../middlewares/verifyUser');

routes.use('/googleAuth', googleAuthRoutes);
routes.use('/auth', authRoutes);
routes.use('/role', verifyUser, roleRoutes);
routes.use('/dish', verifyUser, dishRoutes);

module.exports = routes;
