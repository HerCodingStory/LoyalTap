const mongoose = require('mongoose');

const rewardCardSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerEmail: String,
  points: { type: Number, default: 0 },
  goal: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RewardCard', rewardCardSchema);
