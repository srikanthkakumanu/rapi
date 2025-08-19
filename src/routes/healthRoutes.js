// routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API Health Check
 */

/**
 * @swagger
 * /tapi/health:
 *   get:
 *     summary: Get API health and statistics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds.
 *                 message:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: number
 *                   description: Timestamp of the check.
 *                 version:
 *                   type: string
 *                   description: API version from package.json.
 *                 environment:
 *                   type: string
 *                   description: Node.js environment.
 *                 platform:
 *                   type: string
 *                   description: OS platform.
 *                 nodeVersion:
 *                   type: string
 *                   description: Node.js version.
 *                 memoryUsage:
 *                   type: object
 *                   description: Memory usage statistics.
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *       503:
 *         description: API is unhealthy (e.g., database connection issue).
 */
router.get('/health', healthController.getHealth);

module.exports = router;
