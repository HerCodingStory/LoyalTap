const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/authMiddleware");
const { syncUserFromFirebase } = require("../controllers/authController");

router.post("/auth/sync", verifyToken, syncUserFromFirebase);

module.exports = router;
