const express = require('express');
const { createPassWithQR,
        getAllPasses,
        createLoyaltyClass,
        createPassLink,
        deleteCustomerCard,
        deleteCustomerPasses } = require('../controllers/passController');
const verifyFirebaseToken = require('../middleware/firebaseAuth');
const router = express.Router();

router.post('/google/generate-pass-with-qr', verifyFirebaseToken, createPassWithQR);
router.get('/google/all', verifyFirebaseToken, getAllPasses);
// router.post('/google/regenerate-pass', verifyFirebaseToken, regenerateCustomerPass);
// router.delete('/customer/pass', verifyFirebaseToken, deleteCustomerPasses);
// router.delete('/customer/reward', verifyFirebaseToken, deleteCustomerCard);
router.post('/google/create-class', verifyFirebaseToken, createLoyaltyClass);
router.post('/google/generate-pass-link', verifyFirebaseToken, createPassLink);

module.exports = router;

