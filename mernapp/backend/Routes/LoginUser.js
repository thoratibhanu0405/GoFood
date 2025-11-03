const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const key = process.env.JWT_SECRET;

router.post('/loginuser', [
  body('email').isEmail(),
  body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, key);

    return res.json({ success: true, authToken });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
});

module.exports = router;
