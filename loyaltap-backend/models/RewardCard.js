const mongoose = require('mongoose');

const rewardCardSchema = new mongoose.Schema({
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
        default: 0
    },
    goal: {
        type: Number,
        default: 10
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

rewardCardSchema.index({ restaurantId: 1, customerEmail: 1 }, { unique: true });

module.exports = mongoose.model('RewardCard', rewardCardSchema);
