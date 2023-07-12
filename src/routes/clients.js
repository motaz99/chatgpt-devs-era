const express = require('express');

const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/', clientController.createClient);
router.get('/me', clientController.getClient);
router.put('/me', clientController.updateClient);
// router.post('/me/favorite-dishes', clientController.createFavoriteDish);
// router.delete('/me/favorite-dishes/:id', clientController.deleteFavoriteDish);

module.exports = router;
