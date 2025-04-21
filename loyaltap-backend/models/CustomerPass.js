const mongoose = require('mongoose');

const customerPassSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  passUrl: {
    type: String,
    required: true
  },
  qrCode: {
    type: String, // base64 PNG
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CustomerPass', customerPassSchema);
