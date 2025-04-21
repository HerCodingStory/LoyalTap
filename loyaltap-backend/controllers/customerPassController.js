const { createGooglePass, generateQRCode } = require('../utils/googleWalletUtils');
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
  const { customerEmail, customerPhone, customerName, points, goal } = req.body;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  if (!customerEmail || points == null || goal == null) {
    return res.status(400).json({ message: 'Missing customerEmail, phone_number, name, points, or goal' });
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
      card = await RewardCard.create({ restaurantId, customerEmail, customerPhone, customerName, points, goal });
      await card.save();
    } else {
      card.customerPhone = customerPhone;
      card.customerName = customerName;
      card.points = points;
      card.goal = goal;
      card.lastUpdated = Date.now();
      await card.save();
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
  const { customerEmail, customerPhone, customerName, points, goal } = req.body;
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
      card = await RewardCard.create({ restaurantId, customerEmail, customerPhone, customerName, points, goal });
      await card.save();
    } else {
      card.customerPhone = customerPhone;
      card.customerName = customerName;
      card.points = points;
      card.goal = goal;
      card.lastUpdated = Date.now();
      await card.save();
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
 * GET /api/pass/customer-pass/all
 * Lists all passes created by the logged-in restaurant
 */
// TODO: test in postman
exports.getAllCustomerPasses = async (req, res) => {
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
 * GET /api/pass/google/customer-pass/:email
 * Lists all passes created by the logged-in restaurant
 */
// TODO: test in postman
exports.getCustomerPass = async (req, res) => {
  const { email } = req.params;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  try {
    const pass = await CustomerPass.findOne({ restaurantId: req.user.id, customerEmail: email });

    if (!pass)
      return res.status(404).json({message: 'No pass found'});
    else {
      res.json(pass);
    }
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Failed to fetch customer.' });
  }
};

/**
 * DELETE /api/pass/customer-pass/delete-pass
 * Delete customer pass generated
 */
// TODO: test in postman
exports.deleteCustomerPass = async (req, res) => {
  const { customerEmail } = req.body;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  const restaurantId = restaurantUser._id;

  try {
    await CustomerPass.deleteOne({ restaurantId, customerEmail });
    res.json({ message: 'Customer pass deleted successfully' });
  } catch (err) {
    console.error('Error deleting pass:', err);
    res.status(500).json({ message: 'Failed to delete pass.' });
  }
};

/**
 * POST /api/pass/customer-pass/pass-link
 * Get previous customer pass link
 */
// TODO: test in postman
exports.getCustomerPassLink = async (req, res) => {
  const { customerEmail } = req.body;
  const firebaseUid = req.user.uid;
  const restaurantUser = await User.findOne({ firebaseUid });

  if (!restaurantUser) {
    return res.status(401).json({ message: 'Restaurant user not found' });
  }

  const restaurantId = restaurantUser._id;

  if (!customerEmail) {
    return res.status(400).json({ message: 'Missing customerEmail' });
  }

  try {
    const pass = await CustomerPass.findOne({ restaurantId, customerEmail });

    if (!pass) {
      return res.status(404).json({ message: 'No reward card found for this customer.' });
    }

    const passUrl = pass.passUrl;
    const qrCode = pass.qrCode;

    res.json({ passUrl, qrCode });
  } catch (err) {
    console.error('Error getting the pass:', err);
    res.status(500).json({ message: 'Failed to get pass.' });
  }
};