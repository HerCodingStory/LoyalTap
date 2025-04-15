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
router.post('/google/create-class', verifyFirebaseToken, async (req, res) => {
    const { programName, logoUrl } = req.body;
    const uidSafe = restaurantName.replace(/[^a-zA-Z0-9]/g, '');
    const classId = `${process.env.GOOGLE_WALLET_ISSUER_ID}.${uidSafe}_loyalty_class`;

    if (!restaurantName || !programName || !logoUrl) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const result = await createLoyaltyClass({
            classId,
            restaurantName,
            programName,
            logoUrl,
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create loyalty class' });
    }
});

router.post('/google/generate-pass', verifyFirebaseToken, async (req, res) => {
    const { customerEmail, points, goal, restaurantName } = req.body;
    const classId = `${process.env.GOOGLE_WALLET_ISSUER_ID}.${restaurantName}_loyalty_class`;

    if (typeof customerEmail !== 'string') {
        console.error('Invalid customerEmail:', customerEmail);
        return res.status(400).json({ message: 'Invalid customerEmail' });
    }

    try {
        const url = createGooglePass(customerEmail, points, goal, classId);
        res.json({ url});
    } catch (err) {
        console.error('Pass generation failed:', err);
        res.status(500).json({ message: 'Failed to generate pass' });
    }
});


module.exports = router;

