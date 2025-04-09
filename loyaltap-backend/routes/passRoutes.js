const express = require('express');
const { createOrUpdateCard, getCardsByRestaurant } = require('../controllers/passController');
const { createGooglePass, createLoyaltyClass } = require('../utils/googleWalletUtils');
const router = express.Router();

router.post('/update', createOrUpdateCard);
router.get('/:restaurantId', getCardsByRestaurant);

// For Testing
router.get('/google/create-class', createLoyaltyClass);
router.post('/google/generate-pass', (req, res) => {
    const { customerEmail, points, goal } = req.body;

    if (!customerEmail || points == null || goal == null) {
        return res.status(400).json({ message: 'Missing customerEmail, points, or goal' });
    }

    try {
        const url = createGooglePass(customerEmail, points, goal);
        res.json({ url });
    } catch (err) {
        console.error('Error generating pass:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

