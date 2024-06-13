const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { hashPassword, generateAccessToken, authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashPwd = await hashPassword(password);

    user = new User({
      username,
      email,
      password: hashPwd
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const validData = {
      user: {
        _id: user._id,
        username: user.username
      }
    };

    const userToken = generateAccessToken(validData);
    res.json({ token: userToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
