const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const key = process.env.JWT_SECRET;

router.post('/createuser', [
  body('email').isEmail(),
  body('name').isLength({ min: 5 }),
  body('password').isLength({ min: 5 }),
  body('location').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      password: secPassword,
      email: req.body.email,
      location: req.body.location
    });

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, key);

    return res.json({ success: true, authToken });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ success: false, error: "Signup failed" });
  }
});

module.exports = router;
