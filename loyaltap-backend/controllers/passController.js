const { createGooglePass, generateQRCode } = require('../utils/googleWalletUtils');
const CustomerPass = require('../models/CustomerPass');

exports.createPassWithQR = async (req, res) => {
  const { customerEmail, points, goal } = req.body;

  try {
    const passUrl = createGooglePass(customerEmail, points, goal);
    const qrCode = await generateQRCode(passUrl);

    const pass = await CustomerPass.create({
      restaurantId: req.user?.id || '67f751ac0ed18f5d6a787bc8', // TODO: replace id when we add JWT
      customerEmail,
      points,
      goal,
      passUrl,
      qrCode
    });

    res.json({ passUrl, qrCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate pass' });
  }
};

exports.getAllPasses = async (req, res) => { // TODO: replace id when we add JWT
  const passes = await CustomerPass.find({ restaurantId: req.user?.id || '67f751ac0ed18f5d6a787bc8' }).sort({ createdAt: -1 });
  res.json(passes);
};