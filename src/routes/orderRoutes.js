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

module.exports = router;
