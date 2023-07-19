const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');
const isUserCreatedChef = require('../middlewares/chefExistenceCheker');
const isUserCreatedClient = require('../middlewares/clientExistenceCheker');
const { verifyChef, verifyClient } = require('../middlewares/verfiyRole');

router.use(express.json());

router.post('/', verifyClient, isUserCreatedClient, orderController.postOrder);
router.get(
  '/chef-orders',
  verifyChef,
  isUserCreatedChef,
  orderController.getChefOrders
);
router.put(
  '/chef-update-order-status',
  verifyChef,
  isUserCreatedChef,
  orderController.chefUpdateOrderStatus
);

module.exports = router;
