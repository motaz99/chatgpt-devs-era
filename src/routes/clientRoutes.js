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
router.get('/chefs', isUserCreatedClient, clientController.getChefs);
router.get('/chefs/:id', isUserCreatedClient, clientController.getChefsDishes);

module.exports = router;
