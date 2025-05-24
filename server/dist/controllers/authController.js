"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getMe = exports.logout = exports.login = exports.register = exports.UserRole = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
var UserRole;
(function (UserRole) {
    UserRole["AGENCY"] = "AGENCY";
    UserRole["CLIENT"] = "CLIENT";
})(UserRole || (exports.UserRole = UserRole = {}));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_EXPIRES_IN,
    });
};
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.config.JWT_REFRESH_SECRET, {
        expiresIn: config_1.config.JWT_REFRESH_EXPIRES_IN,
    });
};
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, role, companyName, companyType, industry, country, website, linkedinProfile, description } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Missing required fields: email, password, firstName, lastName',
                statusCode: 400,
            },
        });
    }
    if (role && !Object.values(UserRole).includes(role)) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Invalid role. Must be AGENCY or CLIENT',
                statusCode: 400,
            },
        });
    }
    if (role === UserRole.AGENCY) {
        if (!companyName || !companyType || !industry || !country) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Agency registration requires: companyName, companyType, industry, country',
                    statusCode: 400,
                },
            });
        }
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User with this email already exists',
                    statusCode: 400,
                },
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, config_1.config.BCRYPT_ROUNDS);
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    passwordHash,
                    firstName,
                    lastName,
                    role: role || UserRole.CLIENT,
                },
            });
            let agency = null;
            if (role === UserRole.AGENCY) {
                agency = await tx.agency.create({
                    data: {
                        name: companyName,
                        companyType,
                        industry,
                        country,
                        website: website || null,
                        linkedinProfile: linkedinProfile || null,
                        description: description || null,
                        ownerId: user.id,
                    },
                });
            }
            return { user, agency };
        });
        const token = generateToken(result.user.id);
        const refreshToken = generateRefreshToken(result.user.id);
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
        const { passwordHash: _, ...userWithoutPassword } = result.user;
        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                agency: result.agency,
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
        return res.status(400).json({
            success: false,
            error: {
                message: 'Email and password are required',
                statusCode: 400,
            },
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    statusCode: 401,
                },
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    statusCode: 401,
                },
            });
        }
        if (user.isSuspended) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Account is suspended. Please contact support.',
                    statusCode: 403,
                },
            });
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        let agency = null;
        if (user.role === UserRole.AGENCY) {
            agency = await prisma.agency.findUnique({
                where: { ownerId: user.id },
            });
        }
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
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
                agency,
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
        return res.status(401).json({
            success: false,
            error: {
                message: 'Not authenticated',
                statusCode: 401,
            },
        });
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
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    statusCode: 404,
                },
            });
        }
        let agency = null;
        if (user.role === UserRole.AGENCY) {
            agency = await prisma.agency.findUnique({
                where: { ownerId: user.id },
            });
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                agency,
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
        return res.status(401).json({
            success: false,
            error: {
                message: 'Refresh token not provided',
                statusCode: 401,
            },
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_REFRESH_SECRET);
        const newToken = generateToken(decoded.userId);
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