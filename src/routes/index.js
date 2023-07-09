const express = require('express');

const routes = express.Router();
const normalAuthRoutes = require('./authRoutes');

routes.use('/normalAuth', normalAuthRoutes);

module.exports = routes;
