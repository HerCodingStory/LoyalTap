const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: false, // You might not always get it from Firebase
    default: "New User"
  },
  role: {
    type: String,
    enum: ['restaurant', 'customer'],
    default: 'restaurant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  loyaltyClassId: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
