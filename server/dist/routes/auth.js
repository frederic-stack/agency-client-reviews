"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.body)('companyName').notEmpty().withMessage('Company name is required'),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
router.post('/register', registerValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Validation errors',
                details: errors.array(),
                statusCode: 400,
            },
        });
        return;
    }
    const { email, password, companyName, websiteUrl = '', industry = 'Other', country = 'Unknown', linkedinProfile = null } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
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
                email,
                passwordHash,
                companyName,
                websiteUrl,
                industry,
                country,
                linkedinProfile,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                token,
            },
            message: 'Agency/Freelancer registered successfully',
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
}));
router.post('/login', loginValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Validation errors',
                details: errors.array(),
                statusCode: 400,
            },
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
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
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.config.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token,
            },
            message: 'Login successful',
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
}));
router.post('/logout', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
}));
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                companyName: true,
                websiteUrl: true,
                industry: true,
                country: true,
                linkedinProfile: true,
                isActive: true,
                isVerified: true,
                createdAt: true,
                lastLoginAt: true,
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
        res.json({
            success: true,
            data: {
                user,
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
}));
router.get('/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working',
        routes: [
            'POST /register - Register new agency/freelancer',
            'POST /login - Login with email/password',
            'POST /logout - Logout user',
            'GET /me - Get current user info',
        ],
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map