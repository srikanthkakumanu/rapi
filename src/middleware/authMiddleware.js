// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('No token, authorization denied');
    }

    // The JWT secret should be stored in environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined in environment variables.');
      // This is a server configuration issue, not a client error.
      throw new Error('Server configuration error');
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    // Catch specific JWT errors and wrap them in our custom UnauthorizedError
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError(`Token is not valid: ${err.message}`));
    }
    // Pass all other errors to the centralized error handler
    next(err);
  }
};

module.exports = auth;
