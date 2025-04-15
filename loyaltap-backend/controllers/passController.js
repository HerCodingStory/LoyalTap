const { createGooglePass, generateQRCode, createLoyaltyClass } = require('../utils/googleWalletUtils');
const CustomerPass = require('../models/CustomerPass');
const RewardCard = require('../models/RewardCard');
const User = require('../models/User');

/**
 * POST /api/pass/google/create-class
 * Creates a new class for each restaurant
 */
exports.createLoyaltyClass = async (req, res) => {
  const firebaseUid = req.user.uid;
  const { restaurantName, programName, logoUrl } = req.body;

  const restaurantUser = await User.findOne({ firebaseUid });
  if (!restaurantUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const uidSafe = firebaseUid.replace(/[^a-zA-Z0-9]/g, '');
  const classId = `${process.env.GOOGLE_WALLET_ISSUER_ID}.${uidSafe}_loyalty`;

  try {
    const result = await createLoyaltyClass({
      classId,
      restaurantName,
      programName,
      logoUrl
    });

    // Save classId to user
    restaurantUser.loyaltyClassId = classId;
    await restaurantUser.save();

    return res.status(200).json({
      message: 'Loyalty class created successfully',
      classId
    });
  } catch (err) {
    console.error('Failed to create loyalty class:', err);
    return res.status(500).json({ message: 'Failed to create loyalty class' });
  }
};

/**
 * POST /api/pass/google/generate-pass-with-qr
 * Creates a new Wallet pass, saves it, and returns pass + QR
 */
exports.createPassWithQR = async (req, res) => {
  const { customerEmail, points, goal } = req.body;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  if (!customerEmail || points == null || goal == null) {
    return res.status(400).json({ message: 'Missing customerEmail, points, or goal' });
  }

  if (!restaurantUser.loyaltyClassId) {
    return res.status(400).json({ message: 'Loyalty class not created yet. Please set it up in settings first.' });
  }

  const restaurantId = restaurantUser._id;

  try {
    const passUrl = createGooglePass(customerEmail, points, goal, restaurantUser.loyaltyClassId);
    const qrCode = await generateQRCode(passUrl);

    let card = await RewardCard.findOne({ restaurantId, customerEmail });
    if (!card) {
      card = await RewardCard.create({ restaurantId, customerEmail, points, goal });
    }

    const pass = await CustomerPass.create({
      restaurantId,
      customerEmail,
      points,
      goal,
      passUrl,
      qrCode
    });

    res.json({ passUrl, qrCode });
  } catch (err) {
    console.error('Error generating pass:', err);
    res.status(500).json({ message: 'Something went wrong generating the pass.' });
  }
};

/**
 * POST /api/pass/google/generate-pass
 * Creates a new Wallet pass, saves it, and returns pass link
 */
exports.createPassLink = async (req, res) => {
  const { customerEmail, points, goal } = req.body;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  if (!customerEmail || points == null || goal == null) {
    return res.status(400).json({ message: 'Missing customerEmail, points, or goal' });
  }

  if (!restaurantUser.loyaltyClassId) {
    return res.status(400).json({ message: 'Loyalty class not created yet. Please set it up in settings first.' });
  }

  const restaurantId = restaurantUser._id;

  try {
    const passUrl = createGooglePass(customerEmail, points, goal, restaurantUser.loyaltyClassId);


    let card = await RewardCard.findOne({ restaurantId, customerEmail });
    if (!card) {
      card = await RewardCard.create({ restaurantId, customerEmail, points, goal });
    }

    const pass = await CustomerPass.create({
      restaurantId,
      customerEmail,
      points,
      goal,
      passUrl,
      undefined
    });

    res.json({ passUrl});
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
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  try {
    const passes = await CustomerPass.find({ restaurantId: restaurantUser._id }).sort({ createdAt: -1 });
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
// exports.regenerateCustomerPass = async (req, res) => {
//   const { customerEmail } = req.body;
//   const firebaseUid = req.user.uid;
//   const restaurantUser = await User.findOne({ firebaseUid });
//
//   if (!restaurantUser) {
//     return res.status(401).json({ message: 'Restaurant user not found' });
//   }
//
//   const restaurantId = restaurantUser._id;
//
//   if (!customerEmail) {
//     return res.status(400).json({ message: 'Missing customerEmail' });
//   }
//
//   try {
//     const card = await RewardCard.findOne({ restaurantId, customerEmail });
//
//     if (!card) {
//       return res.status(404).json({ message: 'No reward card found for this customer.' });
//     }
//
//     const passUrl = createGooglePass(customerEmail, card.points, card.goal);
//     const qrCode = await generateQRCode(passUrl);
//
//     const newPass = await CustomerPass.create({
//       restaurantId,
//       customerEmail,
//       points: card.points,
//       goal: card.goal,
//       passUrl,
//       qrCode
//     });
//
//     res.json({ passUrl, qrCode });
//   } catch (err) {
//     console.error('Error regenerating pass:', err);
//     res.status(500).json({ message: 'Failed to regenerate pass.' });
//   }
// };

/**
 * DELETE /api/pass/customer/pass
 * Delete customer pass generated
 */
// exports.deleteCustomerPasses = async (req, res) => {
//   const { customerEmail } = req.body;
//   const firebaseUid = req.user.uid;
//   const restaurantUser = await User.findOne({ firebaseUid });
//
//   if (!restaurantUser) {
//     return res.status(401).json({ message: 'Restaurant user not found' });
//   }
//
//   const restaurantId = restaurantUser._id;
//
//   try {
//     await CustomerPass.deleteMany({ restaurantId, customerEmail });
//     res.json({ message: 'Customer passes deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting passes:', err);
//     res.status(500).json({ message: 'Failed to delete passes.' });
//   }
// };

/**
 * DELETE /api/pass/customer/reward
 * Delete customer reward card
 */
// exports.deleteCustomerCard = async (req, res) => {
//   const { customerEmail } = req.body;
//   const firebaseUid = req.user.uid;
//   const restaurantUser = await User.findOne({ firebaseUid });
//
//   if (!restaurantUser) {
//     return res.status(401).json({ message: 'Restaurant user not found' });
//   }
//
//   const restaurantId = restaurantUser._id;
//
//   try {
//     await RewardCard.deleteOne({ restaurantId, customerEmail });
//     res.json({ message: 'Reward card deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting reward card:', err);
//     res.status(500).json({ message: 'Failed to delete reward card.' });
//   }
// };
