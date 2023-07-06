const express = require('express');
const decideRole = require('../controllers/role');

const routes = express.Router();

routes.put('/', decideRole);

module.exports = routes;
