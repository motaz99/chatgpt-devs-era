const express = require('express');
const dishRoutes = require('./dishRoutes');
const chef = require('../controllers/chefController');
const isUserCreatedChef = require('../middlewares/chefExistenceCheker');

const router = express.Router();

router.post('/', chef.createChef);
router.get('/me', isUserCreatedChef, chef.getChefInfo);
router.put('/me', isUserCreatedChef, chef.editChefInfo);
router.use('/dish', isUserCreatedChef, dishRoutes);

module.exports = router;
