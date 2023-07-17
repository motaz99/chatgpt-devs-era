const express = require('express');
const dishRoutes = require('./dishRoutes');
const chef = require('../controllers/chefController');

const router = express.Router();

router.post('/', chef.createChef);
router.get('/me', chef.getChefInfo);
router.put('/me', chef.editChefInfo);
router.use('/dish', dishRoutes);

module.exports = router;
