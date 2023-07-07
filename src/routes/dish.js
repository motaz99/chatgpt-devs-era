const express = require('express');

const router = express.Router();
const dishController = require('../controllers/dishController');

router.use(express.json());

router.post('/', dishController.createDish); // Create a route for creating a new dish
router.get('/', dishController.getAllDishes); // Create a route for getting all dishes

module.exports = router;
