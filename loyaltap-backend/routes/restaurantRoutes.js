const express = require('express');
const verifyFirebaseToken = require("../middleware/firebaseAuth");
const { getAllCustomersRewardCards,
        getCustomerRewardCard,
        updateCustomerPoints,
        updateCustomerInfo,
        deleteCustomerCard } = require('../controllers/restaurantController');
const router = express.Router();

router.get('/reward-card/all', verifyFirebaseToken, getAllCustomersRewardCards);
router.post('/reward-card/one', verifyFirebaseToken, getCustomerRewardCard);
router.post('/reward-card/update-points', verifyFirebaseToken, updateCustomerPoints);
router.post('/reward-card/update-info', verifyFirebaseToken, updateCustomerInfo);
router.delete('/reward-card/delete-card', verifyFirebaseToken, deleteCustomerCard);

module.exports = router;
