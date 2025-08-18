// middleware/errorMiddleware.js
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  // If the error is one of our custom AppErrors, use its properties.
  // Otherwise, default to a 500 Internal Server Error.
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : 'An unexpected error occurred.';

  // For operational errors (like 404, 409), we can log as 'warn' to reduce noise.
  // For true server errors (500), we log as 'error'.
  const logLevel = err.isOperational && statusCode < 500 ? 'warn' : 'error';
  logger[logLevel](`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
  });

  // Avoid sending response headers if they have already been sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    message: message,
    // It's good practice not to leak stack traces to the client in production
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorMiddleware;