const express = require('express');
const chef = require('../controllers/chefController');

const router = express.Router();

router.post('/', chef.createChef);
router.get('/me', chef.getChefInfo);
router.put('/me', chef.editChefInfo);

module.exports = router;
