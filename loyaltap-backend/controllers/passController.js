const { createGooglePass, generateQRCode } = require('../utils/googleWalletUtils');
const CustomerPass = require('../models/CustomerPass');
const RewardCard = require('../models/RewardCard');

/**
 * POST /api/pass/google/generate-pass-with-qr
 * Creates a new Wallet pass, saves it, and returns pass + QR
 */
exports.createPassWithQR = async (req, res) => {
  const { customerEmail, points, goal } = req.body;
  const restaurantId = req.user.id;

  if (!customerEmail || points == null || goal == null) {
    return res.status(400).json({ message: 'Missing customerEmail, points, or goal' });
  }

  try {
    // 1. Generate Wallet pass URL
    const passUrl = createGooglePass(customerEmail, points, goal);

    // 2. Generate QR code from pass URL
    const qrCode = await generateQRCode(passUrl);

    // 3. Save or update RewardCard
    let card = await RewardCard.findOne({ restaurantId, customerEmail });
    if (!card) {
      card = await RewardCard.create({ restaurantId, customerEmail, points, goal });
    } else {
      card.points = points;
      card.goal = goal;
      card.lastUpdated = Date.now();
      await card.save();
    }

    // 4. Save pass snapshot
    const pass = await CustomerPass.create({
      restaurantId,
      customerEmail,
      points,
      goal,
      passUrl,
      qrCode
    });

    // 5. Return pass & QR
    res.json({ passUrl, qrCode });
  } catch (err) {
    console.error('Error generating pass:', err);
    res.status(500).json({ message: 'Something went wrong generating the pass.' });
  }
};

/**
 * GET /api/pass/google/all
 * Lists all passes created by the logged-in restaurant
 */
exports.getAllPasses = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const passes = await CustomerPass.find({ restaurantId }).sort({ createdAt: -1 });
    res.json(passes);
  } catch (err) {
    console.error('Error fetching passes:', err);
    res.status(500).json({ message: 'Failed to fetch passes.' });
  }
};

/**
 * POST /api/pass/google/regenerate-pass
 * Renegerate customer pass
 */
exports.regenerateCustomerPass = async (req, res) => {
  const { customerEmail } = req.body;
  const restaurantId = req.user.id;

  if (!customerEmail) {
    return res.status(400).json({ message: 'Missing customerEmail' });
  }

  try {
    const card = await RewardCard.findOne({ restaurantId, customerEmail });

    if (!card) {
      return res.status(404).json({ message: 'No reward card found for this customer.' });
    }

    const passUrl = createGooglePass(customerEmail, card.points, card.goal);
    const qrCode = await generateQRCode(passUrl);

    const newPass = await CustomerPass.create({
      restaurantId,
      customerEmail,
      points: card.points,
      goal: card.goal,
      passUrl,
      qrCode
    });

    res.json({ passUrl, qrCode });
  } catch (err) {
    console.error('Error regenerating pass:', err);
    res.status(500).json({ message: 'Failed to regenerate pass.' });
  }
};

/**
 * DELETE /api/pass/customer/pass
 * Delete customer pass generated
 */
exports.deleteCustomerPasses = async (req, res) => {
  const { customerEmail } = req.body;
  const restaurantId = req.user.id;

  try {
    await CustomerPass.deleteMany({ restaurantId, customerEmail });
    res.json({ message: 'Customer passes deleted successfully' });
  } catch (err) {
    console.error('Error deleting passes:', err);
    res.status(500).json({ message: 'Failed to delete passes.' });
  }
};

/**
 * DELETE /api/pass/customer/reward
 * Delete customer reward card
 */
exports.deleteCustomerCard = async (req, res) => {
  const { customerEmail } = req.body;
  const restaurantId = req.user.id;

  try {
    await RewardCard.deleteOne({ restaurantId, customerEmail });
    res.json({ message: 'Reward card deleted successfully' });
  } catch (err) {
    console.error('Error deleting reward card:', err);
    res.status(500).json({ message: 'Failed to delete reward card.' });
  }
};

