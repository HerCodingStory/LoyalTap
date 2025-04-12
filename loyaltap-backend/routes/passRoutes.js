const express = require('express');
const { createGooglePass, createLoyaltyClass } = require('../utils/googleWalletUtils');
const { createPassWithQR, getAllPasses, regenerateCustomerPass, deleteCustomerCard, deleteCustomerPasses } = require('../controllers/passController');
const verifyFirebaseToken = require('../middleware/firebaseAuth');
const router = express.Router();


router.post('/google/generate-pass-with-qr', verifyFirebaseToken, createPassWithQR);
router.get('/google/all', verifyFirebaseToken, getAllPasses);
// router.delete('/customer/pass', verifyFirebaseToken, deleteCustomerPasses);
// router.post('/google/regenerate-pass', verifyFirebaseToken, regenerateCustomerPass);
// router.delete('/customer/reward', verifyFirebaseToken, deleteCustomerCard);

// Testing Only (One Time for Each Restaurant)
router.get('/google/create-class', createLoyaltyClass);
router.post('/google/generate-pass', verifyFirebaseToken, async (req, res) => {
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

