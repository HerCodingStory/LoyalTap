const RewardCard = require('../models/RewardCard');

exports.createOrUpdateCard = async (req, res) => {
  const { restaurantId, customerEmail } = req.body;

  try {
    let card = await RewardCard.findOne({ restaurantId, customerEmail });

    if (!card) {
      card = await RewardCard.create({ restaurantId, customerEmail });
    } else {
      card.points += 1;
      card.lastUpdated = Date.now();
      await card.save();
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Error handling reward card' });
  }
};

exports.getCardsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const cards = await RewardCard.find({ restaurantId });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cards' });
  }
};
