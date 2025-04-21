//TODO: havent tested
const express = require('express');
const verifyFirebaseToken = require("../middleware/firebaseAuth");
// const { verifyToken } = require('../config/authMiddleware');
const { getAllCustomersRewardCards,
        getCustomerRewardCard,
        updateCustomerPoints,
        updateCustomerInfo,
        deleteCustomerCard } = require('../controllers/rewardCardController');
const router = express.Router();

router.get('/reward-cards', verifyFirebaseToken, getAllCustomersRewardCards);
router.get('/reward-cards/:email', verifyFirebaseToken, getCustomerRewardCard);
router.post('/reward-cards/update-points', verifyFirebaseToken, updateCustomerPoints);
router.post('/reward-cards/update-info', verifyFirebaseToken, updateCustomerInfo);
router.delete('/reward-cards/delete-card', verifyFirebaseToken, deleteCustomerCard);

module.exports = router;
