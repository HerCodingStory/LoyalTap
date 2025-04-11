const User = require("../models/User");

exports.syncUserFromFirebase = async (req, res) => {
  try {
    let user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: req.user.uid,
        email: req.user.email,
        role: "restaurant", // or req.body.role if dynamic
        name: req.user.name || "New Restaurant", // Firebase only includes name if set during registration
      });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ message: "Server error syncing user" });
  }
};
