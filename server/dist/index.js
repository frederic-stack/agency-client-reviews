"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const clients_1 = __importDefault(require("./routes/clients"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const admin_1 = __importDefault(require("./routes/admin"));
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: config_1.config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.RATE_LIMIT_WINDOW_MS,
    max: config_1.config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config_1.config.RATE_LIMIT_WINDOW_MS / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: message => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: config_1.config.MAX_FILE_SIZE }));
app.use(express_1.default.urlencoded({ extended: true, limit: config_1.config.MAX_FILE_SIZE }));
app.use((0, express_session_1.default)({
    secret: config_1.config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config_1.config.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use('/api/health', health_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/clients', clients_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/admin', admin_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'ClientScore API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api/docs',
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
    });
});
app.use(errorHandler_1.errorHandler);
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        await database_1.databaseService.disconnect();
        logger_1.logger.info('Database connections closed.');
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
const startServer = async () => {
    try {
        await database_1.databaseService.connect();
        const server = app.listen(config_1.config.PORT, () => {
            logger_1.logger.info(`🚀 ClientScore API server running on port ${config_1.config.PORT}`);
            logger_1.logger.info(`📚 Environment: ${config_1.config.NODE_ENV}`);
            logger_1.logger.info(`🗄️  Database: Connected`);
            logger_1.logger.info(`🔴 Redis: Connected`);
        });
        server.on('error', (error) => {
            logger_1.logger.error('Server error:', error);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    startServer();
}
exports.default = app;
//# sourceMappingURL=index.js.map