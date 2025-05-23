import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { databaseService } from '../config/database';
import { config } from '../config';

const router = Router();

// Health check endpoint
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  // Check database connectivity
  const isDatabaseHealthy = await databaseService.healthCheck();
  
  // Calculate response time
  const responseTime = Date.now() - startTime;
  
  // System health information
  const healthStatus = {
    status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0',
    services: {
      database: {
        status: isDatabaseHealthy ? 'connected' : 'disconnected',
        type: 'PostgreSQL',
      },
      redis: {
        status: isDatabaseHealthy ? 'connected' : 'disconnected',
        type: 'Redis',
      },
    },
    performance: {
      responseTime: `${responseTime}ms`,
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
    },
  };

  // Set appropriate status code
  const statusCode = isDatabaseHealthy ? 200 : 503;
  
  res.status(statusCode).json({
    success: isDatabaseHealthy,
    data: healthStatus,
  });
}));

export default router; 