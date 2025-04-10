//TODO: havent tested
const RewardCard = require('../models/RewardCard');
const CustomerPass = require('../models/CustomerPass');

exports.getAllRewardCards = async (req, res) => {
    const cards = await RewardCard.find({ restaurantId: req.user.id });
    res.json(cards);
};

exports.getCustomerCard = async (req, res) => {
    const { email } = req.params;
    const card = await RewardCard.findOne({ restaurantId: req.user.id, customerEmail: email });
    if (!card) return res.status(404).json({ message: 'No reward card found' });
    res.json(card);
};

exports.updateCustomerPoints = async (req, res) => {
    const { customerEmail, change } = req.body;

    let card = await RewardCard.findOne({ restaurantId: req.user.id, customerEmail });

    if (!card) {
        card = await RewardCard.create({
            restaurantId: req.user.id,
            customerEmail,
            points: Math.max(0, change),
            goal: 10,
        });
    } else {
        card.points = Math.max(0, card.points + change);
        card.lastUpdated = Date.now();
        await card.save();
    }

    res.json(card);
};

exports.getCustomerPasses = async (req, res) => {
    const { email } = req.params;
    const passes = await CustomerPass.find({ restaurantId: req.user.id, customerEmail: email }).sort({ createdAt: -1 });
    res.json(passes);
};
