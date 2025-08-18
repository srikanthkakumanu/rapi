// Load environment variables from .env file.
// This must be done before any other imports to ensure
// environment variables are available globally.
require('dotenv').config();

// Initialize OpenTelemetry. This must be the first import.
require('./config/opentelemetry');

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging middleware. Replaces morgan.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.headers['user-agent']}`;
    logger.http(message);
  });
  next();
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/rapi/todos', todoRoutes);
app.use('/rapi/auth', authRoutes);
app.use('/rapi', healthRoutes);

// Error Handler
app.use(errorMiddleware);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`RAPI Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start RAPI server:', err);
    process.exit(1);
  }
};

startServer();
