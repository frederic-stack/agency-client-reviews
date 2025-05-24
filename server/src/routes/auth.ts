import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const router = Router();
const prisma = new PrismaClient();

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET);
};

// Input validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('companyName').notEmpty().withMessage('Company name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register endpoint - for agencies/freelancers
router.post('/register', registerValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation errors',
        details: errors.array(),
        statusCode: 400,
      },
    });
  }

  const { 
    email, 
    password, 
    companyName, 
    websiteUrl = '',
    industry = 'Other',
    country = 'Unknown',
    linkedinProfile = null
  } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    // Create user (agency/freelancer)
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

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Agency/Freelancer registered successfully',
    });
  } catch (error) {
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

// Login endpoint
router.post('/login', loginValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation errors',
        details: errors.array(),
        statusCode: 400,
      },
    });
  }

  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
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

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          statusCode: 401,
        },
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is suspended. Please contact support.',
          statusCode: 403,
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
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

// Logout endpoint
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

// Get current user endpoint
router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

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
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          statusCode: 404,
        },
      });
    }
    
    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
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

// Status endpoint for testing
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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

export default router; 