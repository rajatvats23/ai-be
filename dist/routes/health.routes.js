"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: number
 */
router.get('/', health_controller_1.healthCheck);
/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Check MongoDB connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: connected
 *                 database:
 *                   type: string
 *                 collections:
 *                   type: number
 */
router.get('/db', health_controller_1.dbStatus);
/**
 * @swagger
 * /api/health/n8n:
 *   get:
 *     summary: Test n8n webhook connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: n8n webhook is reachable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 webhookUrl:
 *                   type: string
 *                 responseTime:
 *                   type: number
 */
router.get('/n8n', health_controller_1.n8nTest);
/**
 * @swagger
 * /api/health/s3:
 *   get:
 *     summary: Test AWS S3 connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: S3 bucket is accessible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 bucket:
 *                   type: string
 *                 region:
 *                   type: string
 */
router.get('/s3', health_controller_1.s3Test);
exports.default = router;
