const jwt = require('jsonwebtoken');
const admin = require("../firebase"); // path to your firebase.js

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded; // contains uid, email, etc.
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  };
  
  module.exports = { verifyToken };
