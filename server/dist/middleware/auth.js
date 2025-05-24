"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Access token not provided',
                    statusCode: 401,
                },
            });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                companyName: true,
                isActive: true,
                isSuspended: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'User not found',
                    statusCode: 401,
                },
            });
            return;
        }
        if (!user.isActive || user.isSuspended) {
            res.status(403).json({
                success: false,
                error: {
                    message: 'Account is suspended or inactive',
                    statusCode: 403,
                },
            });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            companyName: user.companyName,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Token has expired',
                    statusCode: 401,
                },
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    statusCode: 401,
                },
            });
            return;
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error',
                statusCode: 500,
            },
        });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            next();
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                companyName: true,
                isActive: true,
                isSuspended: true,
            },
        });
        if (user && user.isActive && !user.isSuspended) {
            req.user = {
                id: user.id,
                email: user.email,
                companyName: user.companyName,
            };
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Authentication required',
                    statusCode: 401,
                },
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map