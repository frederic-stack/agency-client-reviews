import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
declare class DatabaseService {
    private static instance;
    private _prisma;
    private _redis;
    private _isConnected;
    private _redisConnected;
    private constructor();
    static getInstance(): DatabaseService;
    get prisma(): PrismaClient | null;
    get redis(): Redis | null;
    get isConnected(): boolean;
    get isRedisConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    healthCheck(): Promise<boolean>;
}
export declare const databaseService: DatabaseService;
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs> | null;
export declare const redis: Redis | null;
export {};
//# sourceMappingURL=database.d.ts.map