const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');

router.use(express.json());

router.post('/', orderController.postOrder);
router.get('/chef-orders', orderController.getChefOrders);

module.exports = router;
