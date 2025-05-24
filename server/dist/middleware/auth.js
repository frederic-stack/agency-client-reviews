"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
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
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Access token not provided',
                    statusCode: 401,
                },
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                isActive: true,
                isSuspended: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'User not found',
                    statusCode: 401,
                },
            });
        }
        if (!user.isActive || user.isSuspended) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Account is suspended or inactive',
                    statusCode: 403,
                },
            });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: 'CLIENT',
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Token has expired',
                    statusCode: 401,
                },
            });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    statusCode: 401,
                },
            });
        }
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error',
                statusCode: 500,
            },
        });
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
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                isActive: true,
                isSuspended: true,
            },
        });
        if (user && user.isActive && !user.isSuspended) {
            req.user = {
                id: user.id,
                email: user.email,
                role: 'CLIENT',
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
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Authentication required',
                    statusCode: 401,
                },
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Insufficient permissions',
                    statusCode: 403,
                },
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map