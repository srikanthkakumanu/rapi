// controllers/healthController.js
const { neon } = require('../db/db');
const { version } = require('../../package.json');
const logger = require('../utils/logger');

exports.getHealth = async (req, res, next) => {
  try {
    let dbStatus = 'ok';
    let dbError = null;

    try {
      // A simple query to check DB connection
      await neon.query('SELECT 1');
    } catch (e) {
      dbStatus = 'error';
      dbError = e.message;
      logger.error('Health check DB connection failed:', e);
    }

    const healthcheck = {
      uptime: process.uptime(),
      message: dbStatus === 'ok' ? 'OK' : 'Service Unavailable',
      timestamp: Date.now(),
      version: version,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      database: {
        status: dbStatus,
      },
    };

    // For security, only show DB error details in non-production environments
    if (dbError && process.env.NODE_ENV !== 'production') {
      healthcheck.database.error = dbError;
    }

    res.status(dbStatus === 'ok' ? 200 : 503).json(healthcheck);
  } catch (error) {
    next(error);
  }
};
