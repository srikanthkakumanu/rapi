// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
  try {
    logger.info(`Registration attempt for email: ${req.body.email}`);
    const { email, password } = req.body;

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create(email, passwordHash);
    logger.info(`User registered successfully: ${newUser.email}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    logger.info(`Login attempt for email: ${req.body.email}`);
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    logger.info(`User logged in successfully: ${user.email}`);
    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    next(error);
  }
};
