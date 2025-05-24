"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.prisma = exports.databaseService = void 0;
const client_1 = require("@prisma/client");
const ioredis_1 = __importDefault(require("ioredis"));
const index_1 = require("./index");
class DatabaseService {
    constructor() {
        this._prisma = null;
        this._redis = null;
        this._isConnected = false;
        this._redisConnected = false;
        try {
            this._prisma = new client_1.PrismaClient({
                log: index_1.config.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
                errorFormat: 'pretty',
            });
        }
        catch (error) {
            console.warn('⚠️  Prisma client initialization failed:', error);
        }
        if (index_1.config.REDIS_URL && index_1.config.REDIS_URL.trim() !== '' && index_1.config.REDIS_URL !== 'redis://localhost:6379') {
            try {
                this._redis = new ioredis_1.default(index_1.config.REDIS_URL, {
                    maxRetriesPerRequest: 1,
                    lazyConnect: true,
                    connectTimeout: 5000,
                });
                this._redis.on('connect', () => {
                    console.log('✅ Redis connected successfully');
                    this._redisConnected = true;
                });
                this._redis.on('error', (error) => {
                    console.warn('⚠️  Redis connection error:', error.message);
                    this._redisConnected = false;
                });
                this._redis.on('close', () => {
                    console.warn('⚠️  Redis connection closed');
                    this._redisConnected = false;
                });
            }
            catch (error) {
                console.warn('⚠️  Redis client initialization failed:', error);
                this._redis = null;
            }
        }
        else {
            console.log('ℹ️  Redis URL not provided or invalid, continuing without Redis...');
            this._redis = null;
        }
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    get prisma() {
        return this._prisma;
    }
    get redis() {
        return this._redis;
    }
    get isConnected() {
        return this._isConnected;
    }
    get isRedisConnected() {
        return this._redisConnected;
    }
    async connect() {
        if (this._prisma) {
            try {
                await this._prisma.$connect();
                console.log('✅ Database connected successfully');
                this._isConnected = true;
            }
            catch (error) {
                console.warn('⚠️  Database connection failed:', error.message);
                console.warn('⚠️  Continuing without database connection...');
                this._isConnected = false;
            }
        }
        if (this._redis) {
            try {
                await this._redis.connect();
                console.log('✅ Redis connected successfully');
                this._redisConnected = true;
            }
            catch (error) {
                console.warn('⚠️  Redis connection failed:', error.message);
                console.warn('⚠️  Continuing without Redis connection...');
                this._redisConnected = false;
            }
        }
        else {
            console.log('ℹ️  Continuing without Redis connection...');
        }
        if (!this._isConnected && !this._redisConnected) {
            console.warn('⚠️  No database connections available. Some features will be limited.');
        }
    }
    async disconnect() {
        if (this._prisma && this._isConnected) {
            try {
                await this._prisma.$disconnect();
                console.log('💔 Database disconnected');
                this._isConnected = false;
            }
            catch (error) {
                console.warn('⚠️  Database disconnection error:', error);
            }
        }
        if (this._redis && this._redisConnected) {
            try {
                await this._redis.disconnect();
                console.log('💔 Redis disconnected');
                this._redisConnected = false;
            }
            catch (error) {
                console.warn('⚠️  Redis disconnection error:', error);
            }
        }
    }
    async healthCheck() {
        let dbHealthy = false;
        let redisHealthy = false;
        if (this._prisma && this._isConnected) {
            try {
                await this._prisma.$queryRaw `SELECT 1`;
                dbHealthy = true;
            }
            catch (error) {
                console.warn('⚠️  Database health check failed:', error.message);
            }
        }
        if (this._redis && this._redisConnected) {
            try {
                await this._redis.ping();
                redisHealthy = true;
            }
            catch (error) {
                console.warn('⚠️  Redis health check failed:', error.message);
            }
        }
        return dbHealthy || redisHealthy || index_1.config.NODE_ENV === 'development';
    }
}
exports.databaseService = DatabaseService.getInstance();
exports.prisma = exports.databaseService.prisma;
exports.redis = exports.databaseService.redis;
//# sourceMappingURL=database.js.map