"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getMe = exports.logout = exports.login = exports.register = exports.UserRole = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const errorHandler_1 = require("../middleware/errorHandler");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
var UserRole;
(function (UserRole) {
    UserRole["AGENCY"] = "AGENCY";
    UserRole["CLIENT"] = "CLIENT";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, companyName, websiteUrl, industry, country, linkedinProfile } = req.body;
    if (!email || !password || !companyName || !industry || !country) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Missing required fields: email, password, companyName, industry, country',
                statusCode: 400,
            },
        });
        return;
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'User with this email already exists',
                    statusCode: 400,
                },
            });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, config_1.config.BCRYPT_ROUNDS);
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash,
                companyName,
                websiteUrl: websiteUrl || '',
                industry,
                country,
                linkedinProfile: linkedinProfile || null,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error during registration',
                statusCode: 500,
            },
        });
    }
});
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Email and password are required',
                statusCode: 400,
            },
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    statusCode: 401,
                },
            });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    statusCode: 401,
                },
            });
            return;
        }
        if (user.isSuspended) {
            res.status(403).json({
                success: false,
                error: {
                    message: 'Account is suspended. Please contact support.',
                    statusCode: 403,
                },
            });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const { passwordHash: _, ...userWithoutPassword } = updatedUser;
        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error during login',
                statusCode: 500,
            },
        });
    }
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});
exports.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            error: {
                message: 'Not authenticated',
                statusCode: 401,
            },
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        reviews: true,
                        bookmarks: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    statusCode: 404,
                },
            });
            return;
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
            },
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Internal server error',
                statusCode: 500,
            },
        });
    }
});
exports.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken: token } = req.cookies;
    if (!token) {
        res.status(401).json({
            success: false,
            error: {
                message: 'Refresh token not provided',
                statusCode: 401,
            },
        });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(token);
        const newToken = (0, jwt_1.generateToken)(decoded.userId);
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.json({
            success: true,
            data: {
                token: newToken,
            },
        });
    }
    catch (error) {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.status(401).json({
            success: false,
            error: {
                message: 'Invalid refresh token',
                statusCode: 401,
            },
        });
    }
});
//# sourceMappingURL=authController.js.map