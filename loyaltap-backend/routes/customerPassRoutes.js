const express = require('express');
const { createPassWithQR,
    createLoyaltyClass,
    createPassLink,
    deleteCustomerPass,
    getAllCustomerPasses,
    getCustomerPass,
    getCustomerPassLink } = require('../controllers/customerPassController');
const verifyFirebaseToken = require('../middleware/firebaseAuth');
const router = express.Router();

router.delete('/customer-pass/delete-pass', verifyFirebaseToken, deleteCustomerPass);
router.get('/customer-pass/all', verifyFirebaseToken, getAllCustomerPasses);
router.post('/customer-pass/one', verifyFirebaseToken, getCustomerPass);
router.post('/customer-pass/pass-link', verifyFirebaseToken, getCustomerPassLink);
router.post('/google/generate-pass-with-qr', verifyFirebaseToken, createPassWithQR);
router.post('/google/generate-pass-link', verifyFirebaseToken, createPassLink);
// TODO: only allow once per restaurant
router.post('/google/create-class', verifyFirebaseToken, createLoyaltyClass);

module.exports = router;