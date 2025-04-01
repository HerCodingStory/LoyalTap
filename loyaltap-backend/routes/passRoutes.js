const express = require('express');
const { createOrUpdateCard, getCardsByRestaurant } = require('../controllers/passController');

const router = express.Router();

router.post('/update', createOrUpdateCard);
router.get('/:restaurantId', getCardsByRestaurant);

module.exports = router;