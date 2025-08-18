// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { neon } = require('../db/db');
const { ConflictError, UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Note: This controller assumes a 'users_tbl' table with at least
 * 'id' (uuid), 'email' (text, unique), and 'password_hash' (text), created (timestamp) columns.
 */

exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUsers =
    await neon`SELECT id FROM users_tbl WHERE email = ${email.toLowerCase()}`;
  if (existingUsers.length > 0) {
    throw new ConflictError('User with this email already exists.');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await neon`
    INSERT INTO users_tbl (email, password_hash) 
    VALUES (${email.toLowerCase()}, ${hashedPassword})
    RETURNING id, email, created
  `;

  logger.info(`User registered successfully: ${newUser[0].email}`);
  res.status(201).json({
    message: 'User registered successfully.',
    user: newUser[0],
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const users =
    await neon`SELECT id, email, password_hash, created FROM users_tbl WHERE email = ${email.toLowerCase()}`;
  if (users.length === 0) {
    // Throw a generic error for security to prevent email enumeration
    throw new UnauthorizedError('Invalid credentials.');
  }
  const user = users[0];

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  // Create and sign JWT
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // It's good practice to set an expiration
  });

  res.status(200).json({
    message: 'Login successful.',
    token: `Bearer ${token}`,
  });
};
