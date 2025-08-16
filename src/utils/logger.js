// utils/logger.js
const fs = require('fs');
const path = require('path');
const util = require('util');

// Define log directory and file path
const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'app.log');

// Ensure log directory exists. This is a one-time synchronous operation.
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a writable stream to the log file for efficiency.
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const getTimestamp = () => new Date().toISOString();

// Helper to format messages, including objects/arrays, for file logging.
const formatForFile = (level, message, args) => {
  const formattedArgs = args
    .map((arg) => (typeof arg === 'object' ? util.inspect(arg, { depth: null }) : arg))
    .join(' ');
  return `[${level}] ${getTimestamp()}: ${message} ${formattedArgs}\n`;
};

const logger = {
  info: (message, ...args) => {
    logStream.write(formatForFile('INFO', message, args));
    console.log(`[INFO] ${getTimestamp()}:`, message, ...args);
  },
  warn: (message, ...args) => {
    logStream.write(formatForFile('WARN', message, args));
    console.warn(`[WARN] ${getTimestamp()}:`, message, ...args);
  },
  error: (message, ...args) => {
    logStream.write(formatForFile('ERROR', message, args));
    console.error(`[ERROR] ${getTimestamp()}:`, message, ...args);
  },
  debug: (message, ...args) => {
    // Only log debug messages if not in production
    if (process.env.NODE_ENV !== 'production') {
      logStream.write(formatForFile('DEBUG', message, args));
      console.log(`[DEBUG] ${getTimestamp()}:`, message, ...args);
    }
  },
};

module.exports = logger;
