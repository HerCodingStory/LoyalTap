const express = require('express');
const { createGooglePass, createLoyaltyClass } = require('../utils/googleWalletUtils');
const { createPassWithQR, getAllPasses, regenerateCustomerPass, deleteCustomerCard, deleteCustomerPasses } = require('../controllers/passController');
const { verifyToken } = require('../config/authMiddleware');
const router = express.Router();

router.post('/google/generate-pass-with-qr', verifyToken, createPassWithQR);
router.get('/google/all', verifyToken, getAllPasses);
router.post('/google/regenerate-pass', verifyToken, regenerateCustomerPass);
router.delete('/customer/pass', verifyToken, deleteCustomerPasses);
router.delete('/customer/reward', verifyToken, deleteCustomerCard);

// Testing Only (One Time)
router.get('/google/create-class', createLoyaltyClass);
router.post('/google/generate-pass', verifyToken, async (req, res) => {
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

