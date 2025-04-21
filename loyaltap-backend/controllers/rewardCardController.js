const RewardCard = require('../models/RewardCard');
const User = require("../models/User");

/**
 * GET /api/restaurant/reward-cards
 * Get all customers info
 */
// TODO: test in postman
exports.getAllCustomersRewardCards = async (req, res) => {
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    try {
        const customers = await RewardCard.find({ restaurantId: req.user.id }).sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ message: 'Failed to fetch customers.' });
    }
};

/**
 * GET /api/restaurant/reward-cards/:email
 * Get one customer info
 */
// TODO: test in postman
exports.getCustomerRewardCard = async (req, res) => {
    const { customerEmail } = req.params;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    try {
        const card = await RewardCard.findOne({restaurantId: req.user.id, customerEmail: customerEmail});
        if (!card)
            return res.status(404).json({message: 'No reward card found'});
        else {
            res.json(card);
        }
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ message: 'Failed to fetch customer.' });
    }
};

/**
 * POST /api/restaurant/reward-cards/update-points
 * Update customer points
 */
// TODO: test in postman
exports.updateCustomerPoints = async (req, res) => {
    const { customerEmail, newPoints } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    try {
        const card = await RewardCard.findOne({restaurantId: req.user.id, customerEmail: customerEmail});
        if (!card) {
            return res.status(404).json({message: 'No reward card found'});
        } else {
            card.points = Math.max(0, card.points + newPoints);
            // TODO: maybe this should be created on
            // card.lastUpdated = Date.now();
            await card.save();
            res.json(card);
        }
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ message: 'Failed to fetch customer.' });
    }
};

/**
 * POST /api/restaurant/reward-cards/update-info
 * Update customer info
 */
// TODO: test in postman
exports.updateCustomerInfo = async (req, res) => {
    const { customerName, customerEmail, customerPhone } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    try {
        const card = await RewardCard.findOne({restaurantId: req.user.id, customerEmail: customerEmail});
        if (!card) {
            return res.status(404).json({message: 'No reward card found'});
        } else {
            card.customerName = customerName;
            card.customerEmail = customerEmail;
            card.customerPhone = customerPhone;
            // TODO: maybe this should be createdOn
            //card.lastUpdated = Date.now();
            await card.save();
            res.json(card);
        }
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ message: 'Failed to fetch customer.' });
    }
};

/**
 * DELETE /api/restaurant/reward-cards/delete-card
 * Delete customer reward card
 */
// TODO: test in postman
exports.deleteCustomerCard = async (req, res) => {
    const { customerEmail } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    const restaurantId = restaurantUser._id;

    try {
        await RewardCard.deleteOne({ restaurantId, customerEmail });
        res.json({ message: 'Reward card deleted successfully' });
    } catch (err) {
        console.error('Error deleting reward card:', err);
        res.status(500).json({ message: 'Failed to delete reward card.' });
    }
};


