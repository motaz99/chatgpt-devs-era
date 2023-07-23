const express = require('express');

const router = express.Router();
const clientController = require('../controllers/clientController');
const isUserCreatedClient = require('../middlewares/clientExistenceCheker');

router.post('/', clientController.createClient);
router.get('/me', isUserCreatedClient, clientController.getClient);
router.put('/me', isUserCreatedClient, clientController.updateClient);
router.post(
  '/me/favorite-dishes',
  isUserCreatedClient,
  clientController.createFavoriteDish
);
router.get(
  '/me/favorite-dishes',
  isUserCreatedClient,
  clientController.getFavoriteDishes
);
router.delete(
  '/me/favorite-dishes/:id',
  isUserCreatedClient,
  clientController.deleteFavoriteDish
);
router.get(
  '/me/order-history',
  isUserCreatedClient,
  clientController.getOrderHistory
);
router.get('/chefs', isUserCreatedClient, clientController.getChefs);
router.post('/rate/:id', isUserCreatedClient, clientController.dishesRatings);

router.get('/chefs/:id', isUserCreatedClient, clientController.getChefById);

module.exports = router;
