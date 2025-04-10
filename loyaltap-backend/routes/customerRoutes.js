const express = require('express');
const { getAllRewardCards, getCustomerCard, updateCustomerPoints, getCustomerPasses} = require('../controllers/customerController');

const router = express.Router();

router.get('/cards', getAllRewardCards);
router.get('/cards/:email', getCustomerCard);
router.post('/cards/update', updateCustomerPoints);
router.get('/passes/:email', getCustomerPasses);

module.exports = router;
