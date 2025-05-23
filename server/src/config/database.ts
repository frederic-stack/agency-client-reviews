import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { config } from './index';

// Prisma Client singleton
class DatabaseService {
  private static instance: DatabaseService;
  private _prisma: PrismaClient | null = null;
  private _redis: Redis | null = null;
  private _isConnected = false;
  private _redisConnected = false;

  private constructor() {
    try {
      this._prisma = new PrismaClient({
        log: config.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        errorFormat: 'pretty',
      });
    } catch (error) {
      console.warn('⚠️  Prisma client initialization failed:', error);
    }

    try {
      this._redis = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 5000,
      });

      // Handle Redis connection events
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
    } catch (error) {
      console.warn('⚠️  Redis client initialization failed:', error);
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public get prisma(): PrismaClient | null {
    return this._prisma;
  }

  public get redis(): Redis | null {
    return this._redis;
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get isRedisConnected(): boolean {
    return this._redisConnected;
  }

  public async connect(): Promise<void> {
    // Try to connect to Prisma
    if (this._prisma) {
      try {
        await this._prisma.$connect();
        console.log('✅ Database connected successfully');
        this._isConnected = true;
      } catch (error) {
        console.warn('⚠️  Database connection failed:', (error as Error).message);
        console.warn('⚠️  Continuing without database connection...');
        this._isConnected = false;
      }
    }
    
    // Try to connect to Redis
    if (this._redis) {
      try {
        await this._redis.connect();
        console.log('✅ Redis connected successfully');
        this._redisConnected = true;
      } catch (error) {
        console.warn('⚠️  Redis connection failed:', (error as Error).message);
        console.warn('⚠️  Continuing without Redis connection...');
        this._redisConnected = false;
      }
    }

    if (!this._isConnected && !this._redisConnected) {
      console.warn('⚠️  No database connections available. Some features will be limited.');
    }
  }

  public async disconnect(): Promise<void> {
    if (this._prisma && this._isConnected) {
      try {
        await this._prisma.$disconnect();
        console.log('💔 Database disconnected');
        this._isConnected = false;
      } catch (error) {
        console.warn('⚠️  Database disconnection error:', error);
      }
    }
    
    if (this._redis && this._redisConnected) {
      try {
        await this._redis.disconnect();
        console.log('💔 Redis disconnected');
        this._redisConnected = false;
      } catch (error) {
        console.warn('⚠️  Redis disconnection error:', error);
      }
    }
  }

  public async healthCheck(): Promise<boolean> {
    let dbHealthy = false;
    let redisHealthy = false;

    // Check database
    if (this._prisma && this._isConnected) {
      try {
        await this._prisma.$queryRaw`SELECT 1`;
        dbHealthy = true;
      } catch (error) {
        console.warn('⚠️  Database health check failed:', (error as Error).message);
      }
    }

    // Check Redis
    if (this._redis && this._redisConnected) {
      try {
        await this._redis.ping();
        redisHealthy = true;
      } catch (error) {
        console.warn('⚠️  Redis health check failed:', (error as Error).message);
      }
    }

    // Return true if at least one service is healthy, or if we're in development mode
    return dbHealthy || redisHealthy || config.NODE_ENV === 'development';
  }
}

export const databaseService = DatabaseService.getInstance();
export const prisma = databaseService.prisma;
export const redis = databaseService.redis; 