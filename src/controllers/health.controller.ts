import { Request, Response } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import { s3, S3_BUCKET } from '../config/s3';

export const healthCheck = async (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};

export const dbStatus = async (req: Request, res: Response) => {
  try {
    const state = mongoose.connection.readyState;
    const stateMap: { [key: number]: string } = {
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

    const db = mongoose.connection.db;
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
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const n8nTest = async (req: Request, res: Response) => {
  try {
    const healthUrl = process.env.N8N_HEALTH_URL;

    if (!healthUrl) {
      return res.status(500).json({
        status: 'error',
        message: 'N8N_HEALTH_URL not configured'
      });
    }

    const startTime = Date.now();
    const response = await axios.get(healthUrl, {
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
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const s3Test = async (req: Request, res: Response) => {
  try {
    if (!S3_BUCKET) {
      return res.status(500).json({
        status: 'error',
        message: 'S3_BUCKET not configured'
      });
    }

    // Test by listing bucket (doesn't cost anything)
    await s3.headBucket({ Bucket: S3_BUCKET }).promise();

    res.json({
      status: 'connected',
      bucket: S3_BUCKET,
      region: process.env.AWS_REGION || 'unknown'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      bucket: S3_BUCKET
    });
  }
};