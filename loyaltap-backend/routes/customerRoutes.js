//TODO: havent tested
const express = require('express');
const { verifyToken } = require('../config/authMiddleware');
const { getAllRewardCards, getCustomerCard, updateCustomerPoints, getCustomerPasses} = require('../controllers/customerController');

const router = express.Router();

router.get('/reward-cards', verifyToken, getAllRewardCards);
router.get('/reward-cards/:email', verifyToken, getCustomerCard);
router.post('/reward-cards/update', verifyToken, updateCustomerPoints);
router.get('/customer-passes/:email', verifyToken, getCustomerPasses);

module.exports = router;
