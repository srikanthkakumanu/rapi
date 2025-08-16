// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // The JWT secret should be stored in environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    // The decoded payload is attached to the request.
    // This assumes the user object is the direct payload of the JWT.
    req.user = decoded;
    next();
  } catch (err) {
    // jwt.verify throws an error for invalid tokens (e.g., expired, malformed)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token is not valid', error: err.message });
    }
    console.error('Authentication error:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = auth;
