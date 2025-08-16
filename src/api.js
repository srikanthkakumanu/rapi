const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
require('dotenv').config();
const logger = require('./utils/logger');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(express.json());

// Configure morgan to stream request logs through our custom logger
const morganStream = {
  write: (message) => {
    // Morgan adds a newline, so we trim it to avoid extra lines in the log.
    logger.info(message.trim());
  },
};

// Use the 'combined' format for detailed, production-ready logs
app.use(morgan('combined', { stream: morganStream }));
// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

// Error Handler
app.use(errorMiddleware);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`RAPI Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start RAPI server:', err);
    process.exit(1);
  }
};

startServer();
