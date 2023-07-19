const express = require('express');

const router = express.Router();
const dishController = require('../controllers/dishController');

router.use(express.json());

router.post('/', dishController.createDish);
router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getDishById);
router.post('/:id', dishController.dishesRatings);

module.exports = router;
