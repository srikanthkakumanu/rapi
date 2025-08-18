// utils/logger.js
const winston = require('winston');
const path = require('path');

// Define log directory and file path
const logDir = path.join(__dirname, '../../logs');

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Set severity based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define format for logging to files
const fileFormat = winston.format.combine(
  // When OpenTelemetry is enabled, it will automatically inject
  // trace_id and span_id into the log metadata.
  // The json() format will then serialize this into the log file.
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.splat(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define format for logging to the console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  // The console logger remains human-readable and does not show OTel context.
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  new winston.transports.Console({ format: consoleFormat }),
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'app.log'),
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

module.exports = logger;
