//TODO: havent tested
const express = require('express');
const { verifyToken } = require('../config/authMiddleware');
const { getAllRewardCards, getCustomerCard, updateCustomerPoints, getCustomerPasses} = require('../controllers/customerController');

const router = express.Router();

router.get('/cards', verifyToken, getAllRewardCards);
router.get('/cards/:email', verifyToken, getCustomerCard);
router.post('/cards/update', verifyToken, updateCustomerPoints);
router.get('/passes/:email', verifyToken, getCustomerPasses);

module.exports = router;
