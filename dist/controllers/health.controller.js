"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Test = exports.n8nTest = exports.dbStatus = exports.healthCheck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const s3_1 = require("../config/s3");
const healthCheck = async (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
};
exports.healthCheck = healthCheck;
const dbStatus = async (req, res) => {
    try {
        const state = mongoose_1.default.connection.readyState;
        const stateMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        if (state !== 1) {
            return res.status(503).json({
                status: stateMap[state],
                message: 'Database not connected'
            });
        }
        const db = mongoose_1.default.connection.db;
        if (!db) {
            return res.status(503).json({
                status: 'disconnected',
                message: 'Database handle not available'
            });
        }
        const collections = await db.listCollections().toArray();
        res.json({
            status: 'connected',
            database: db.databaseName,
            collections: collections.length,
            collectionNames: collections.map(c => c.name)
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
exports.dbStatus = dbStatus;
const n8nTest = async (req, res) => {
    try {
        const healthUrl = process.env.N8N_HEALTH_URL;
        if (!healthUrl) {
            return res.status(500).json({
                status: 'error',
                message: 'N8N_HEALTH_URL not configured'
            });
        }
        const startTime = Date.now();
        const response = await axios_1.default.get(healthUrl, {
            timeout: 5000,
            validateStatus: () => true
        });
        const responseTime = Date.now() - startTime;
        res.json({
            status: response.status === 200 ? 'healthy' : 'unhealthy',
            responseTime: `${responseTime}ms`,
            statusCode: response.status,
            service: response.data?.service || 'unknown'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
exports.n8nTest = n8nTest;
const s3Test = async (req, res) => {
    try {
        if (!s3_1.S3_BUCKET) {
            return res.status(500).json({
                status: 'error',
                message: 'S3_BUCKET not configured'
            });
        }
        // Test by listing bucket (doesn't cost anything)
        await s3_1.s3.headBucket({ Bucket: s3_1.S3_BUCKET }).promise();
        res.json({
            status: 'connected',
            bucket: s3_1.S3_BUCKET,
            region: process.env.AWS_REGION || 'unknown'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
            bucket: s3_1.S3_BUCKET
        });
    }
};
exports.s3Test = s3Test;
