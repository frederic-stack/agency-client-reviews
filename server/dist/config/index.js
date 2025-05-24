"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvVar = (name, defaultValue) => {
    const value = process.env[name] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
};
const getEnvVarOptional = (name, defaultValue) => {
    return process.env[name] || defaultValue;
};
const getEnvNumber = (name, defaultValue) => {
    const value = process.env[name];
    if (!value && defaultValue === undefined) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value ? parseInt(value, 10) : defaultValue;
};
exports.config = {
    DATABASE_URL: getEnvVarOptional('DATABASE_URL', 'postgresql://test:test@localhost:5432/test'),
    REDIS_URL: getEnvVarOptional('REDIS_URL', 'redis://localhost:6379'),
    JWT_SECRET: getEnvVarOptional('JWT_SECRET', 'development-jwt-secret-key'),
    JWT_REFRESH_SECRET: getEnvVarOptional('JWT_REFRESH_SECRET', 'development-refresh-secret-key'),
    JWT_EXPIRES_IN: getEnvVarOptional('JWT_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: getEnvVarOptional('JWT_REFRESH_EXPIRES_IN', '7d'),
    SESSION_SECRET: getEnvVarOptional('SESSION_SECRET', 'development-session-secret-key'),
    GOOGLE_CLIENT_ID: getEnvVarOptional('GOOGLE_CLIENT_ID', 'placeholder-google-client-id'),
    GOOGLE_CLIENT_SECRET: getEnvVarOptional('GOOGLE_CLIENT_SECRET', 'placeholder-google-client-secret'),
    LINKEDIN_CLIENT_ID: getEnvVarOptional('LINKEDIN_CLIENT_ID', 'placeholder-linkedin-client-id'),
    LINKEDIN_CLIENT_SECRET: getEnvVarOptional('LINKEDIN_CLIENT_SECRET', 'placeholder-linkedin-client-secret'),
    SMTP_HOST: getEnvVarOptional('SMTP_HOST', 'smtp.gmail.com'),
    SMTP_PORT: getEnvNumber('SMTP_PORT', 587),
    SMTP_USER: getEnvVarOptional('SMTP_USER', 'placeholder-email@gmail.com'),
    SMTP_PASS: getEnvVarOptional('SMTP_PASS', 'placeholder-app-password'),
    FROM_EMAIL: getEnvVarOptional('FROM_EMAIL', 'noreply@clientscore.com'),
    AKISMET_API_KEY: getEnvVarOptional('AKISMET_API_KEY', 'placeholder-akismet-api-key'),
    AKISMET_BLOG_URL: getEnvVarOptional('AKISMET_BLOG_URL', 'https://clientscore.com'),
    RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
    RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
    BCRYPT_ROUNDS: getEnvNumber('BCRYPT_ROUNDS', 12),
    CORS_ORIGIN: getEnvVarOptional('CORS_ORIGIN', 'http://localhost:3000'),
    PORT: getEnvNumber('PORT', 3001),
    NODE_ENV: getEnvVarOptional('NODE_ENV', 'development'),
    MAX_FILE_SIZE: getEnvVarOptional('MAX_FILE_SIZE', '5mb'),
    UPLOAD_PATH: getEnvVarOptional('UPLOAD_PATH', './uploads'),
    LOG_LEVEL: getEnvVarOptional('LOG_LEVEL', 'info'),
    LOG_FILE: getEnvVarOptional('LOG_FILE', './logs/app.log'),
    GOOGLE_ANALYTICS_ID: getEnvVarOptional('GOOGLE_ANALYTICS_ID', ''),
    CLIENT_URL: getEnvVarOptional('CLIENT_URL', 'http://localhost:3000'),
    SERVER_URL: getEnvVarOptional('SERVER_URL', 'http://localhost:3001'),
    EMAIL_VERIFICATION_EXPIRES_IN: getEnvVarOptional('EMAIL_VERIFICATION_EXPIRES_IN', '24h'),
    PASSWORD_RESET_EXPIRES_IN: getEnvVarOptional('PASSWORD_RESET_EXPIRES_IN', '1h'),
    AUTO_MODERATE_THRESHOLD: getEnvNumber('AUTO_MODERATE_THRESHOLD', 5),
    REVIEW_MIN_LENGTH: getEnvNumber('REVIEW_MIN_LENGTH', 50),
    REVIEW_MAX_LENGTH: getEnvNumber('REVIEW_MAX_LENGTH', 2000),
};
const validateConfig = () => {
    const requiredVars = [
        'JWT_SECRET',
        'SESSION_SECRET'
    ];
    for (const varName of requiredVars) {
        if (!process.env[varName] || process.env[varName]?.includes('placeholder') || process.env[varName]?.includes('your-')) {
            console.warn(`⚠️  Warning: ${varName} is using a default/placeholder value. Please set a secure value in production.`);
        }
    }
};
validateConfig();
exports.default = exports.config;
//# sourceMappingURL=index.js.map