const express = require('express');
const { createGooglePass, createLoyaltyClass } = require('../utils/googleWalletUtils');
const { createPassWithQR, deleteCustomerPass, getCustomerPassLink } = require('../controllers/customerPassController');
const verifyFirebaseToken = require('../middleware/firebaseAuth');
const router = express.Router();

// TODO: This should only be allow one time per restaurant
router.get('/google/create-class', createLoyaltyClass);

router.delete('/customer-pass/delete-pass', verifyFirebaseToken, deleteCustomerPass);
router.post('/customer-pass/pass-link', verifyFirebaseToken, getCustomerPassLink);
router.post('/google/generate-pass-with-qr', verifyFirebaseToken, createPassWithQR);
router.post('/google/generate-pass-link', verifyFirebaseToken, async (req, res) => {
    const { customerEmail, points, goal } = req.body;

    if (typeof customerEmail !== 'string') {
        console.error('Invalid customerEmail:', customerEmail);
        return res.status(400).json({ message: 'Invalid customerEmail' });
    }

    try {
        const url = createGooglePass(customerEmail, points, goal);
        res.json({ url});
    } catch (err) {
        console.error('Pass generation failed:', err);
        res.status(500).json({ message: 'Failed to generate pass' });
    }
});

module.exports = router;

