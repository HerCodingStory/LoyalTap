const RewardCard = require('../models/RewardCard');
const User = require("../models/User");
const CustomerPass = require("../models/CustomerPass");

/**
 * GET /api/restaurant/reward-card/all
 * Get all customers info
 */
exports.getAllCustomersRewardCards = async (req, res) => {
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    try {
        const customers = await RewardCard.find({ restaurantId: restaurantUser._id }).sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ message: 'Failed to fetch customers.' });
    }
};

/**
 * POST /api/restaurant/reward-card/one
 * Get one customer info
 */
exports.getCustomerRewardCard = async (req, res) => {
    const { customerEmail } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    const restaurantId = restaurantUser._id

    try {
        const card = await RewardCard.findOne({restaurantId, customerEmail});

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
 * POST /api/restaurant/reward-card/update-points
 * Update customer points
 */
exports.updateCustomerPoints = async (req, res) => {
    const { customerEmail, newPoints } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    const restaurantId = restaurantUser._id

    try {
        const card = await RewardCard.findOne({restaurantId, customerEmail});
        // TODO: do we have to update pass too??
        //const pass = await CustomerPass.findOne({ restaurantId, customerEmail });

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
 * POST /api/restaurant/reward-card/update-info
 * Update customer info
 */
// TODO: Doesnt work because old bug not saving correct values in db I think
exports.updateCustomerInfo = async (req, res) => {
    const { customerName, customerEmail, customerPhone } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    const restaurantId = restaurantUser._id;

    try {
        const card = await RewardCard.findOne({restaurantId, customerEmail});

        if (!card) {
            return res.status(404).json({message: 'No reward card found'});
        } else {
            card.customerName = customerName;
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
 * DELETE /api/restaurant/reward-card/delete-card
 * Delete customer reward card
 */
exports.deleteCustomerCard = async (req, res) => {
    const { customerEmail } = req.body;
    const firebaseUid = req.user.uid;
    const restaurantUser = await User.findOne({ firebaseUid });

    if (!restaurantUser) {
        return res.status(401).json({ message: 'Restaurant user not found' });
    }

    const restaurantId = restaurantUser._id;

    try {
        // TODO: improve deletion time and efficiency
        const card = await RewardCard.deleteOne({ restaurantId, customerEmail });

        if (!card)
            return res.status(200).json({ message: 'Customer card doesnt exist' });

        await CustomerPass.deleteOne({ restaurantId, customerEmail });
        res.json({ message: 'Reward card deleted successfully' });

    } catch (err) {
        console.error('Error deleting reward card:', err);
        res.status(500).json({ message: 'Failed to delete reward card.' });
    }
};


