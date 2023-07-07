const express = require('express');

const routes = express.Router();

const dishRoutes = require('./dish');

routes.use('/dish', dishRoutes);

module.exports = routes;
