import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { asyncHandler } from '../middleware/errorHandler';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

const prisma = new PrismaClient();

// User roles enum (matching Prisma schema)
export enum UserRole {
  AGENCY = 'AGENCY',
  CLIENT = 'CLIENT'
}

// Register user
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    email,
    password,
    companyName,
    websiteUrl,
    industry,
    country,
    linkedinProfile
  } = req.body;

  // Validate required fields
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
    // Check if user already exists
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    // Create user
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

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set HTTP-only cookie for token
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
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
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
    // Find user
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

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
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

    // Check if user is suspended
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

    // Update last login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set HTTP-only cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
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
});

// Logout user
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Get current user
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

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

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
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
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
    const decoded = verifyRefreshToken(token);
    
    // Generate new access token
    const newToken = generateToken(decoded.userId);

    // Set new token in cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      success: true,
      data: {
        token: newToken,
      },
    });
  } catch (error) {
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