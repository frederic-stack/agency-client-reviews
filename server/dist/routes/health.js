"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const database_1 = require("../config/database");
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const startTime = Date.now();
    const isDatabaseHealthy = await database_1.databaseService.healthCheck();
    const responseTime = Date.now() - startTime;
    const healthStatus = {
        status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.config.NODE_ENV,
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
    const statusCode = isDatabaseHealthy ? 200 : 503;
    res.status(statusCode).json({
        success: isDatabaseHealthy,
        data: healthStatus,
    });
}));
exports.default = router;
//# sourceMappingURL=health.js.map