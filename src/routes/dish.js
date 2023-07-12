const express = require('express');

const router = express.Router();
const dishController = require('../controllers/dishController');

router.use(express.json());

router.post('/', dishController.createDish);
router.get('/', dishController.getAllDishes);
router.post('/getDish', dishController.getDish);

module.exports = router;
