const express = require("express");
const router = express.Router();
const { verifyToken } = require("../config/authMiddleware");
const { syncUserFromFirebase } = require("../controllers/authController");

router.post("/auth/sync", verifyToken, syncUserFromFirebase);
router.get('/auth/me', verifyToken, syncUserFromFirebase);
module.exports = router;
