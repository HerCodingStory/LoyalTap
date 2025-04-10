const mongoose = require('mongoose');

const customerPassSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false //TODO: just for testing, set true again later
  },
  customerEmail: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  passUrl: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String, // base64 PNG image
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rewardCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RewardCard'
  }
});

module.exports = mongoose.model('CustomerPass', customerPassSchema);
