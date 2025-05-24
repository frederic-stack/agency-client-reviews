import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// User roles enum (matching Prisma schema)
export enum UserRole {
  AGENCY = 'AGENCY',
  CLIENT = 'CLIENT'
}

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

// Generate refresh token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
};

// Register user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    // Agency specific fields
    companyName,
    companyType,
    industry,
    country,
    website,
    linkedinProfile,
    description
  } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Missing required fields: email, password, firstName, lastName',
        statusCode: 400,
      },
    });
  }

  // Validate role
  if (role && !Object.values(UserRole).includes(role)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid role. Must be AGENCY or CLIENT',
        statusCode: 400,
      },
    });
  }

  // If role is AGENCY, require company information
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
    // Check if user already exists
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    // Create user with transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          role: role || UserRole.CLIENT,
        },
      });

      // Create agency if user is an agency
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

    // Generate tokens
    const token = generateToken(result.user.id);
    const refreshToken = generateRefreshToken(result.user.id);

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
    const { passwordHash: _, ...userWithoutPassword } = result.user;
    
    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        agency: result.agency,
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
export const login = asyncHandler(async (req: Request, res: Response) => {
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
    // Find user with agency relation
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

    // Update last login and get agency info
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Get agency info if user is an agency
    let agency = null;
    if (user.role === UserRole.AGENCY) {
      agency = await prisma.agency.findUnique({
        where: { ownerId: user.id },
      });
    }

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
        agency,
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
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Get current user
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

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

    // Get agency info if user is an agency
    let agency = null;
    if (user.role === UserRole.AGENCY) {
      agency = await prisma.agency.findUnique({
        where: { ownerId: user.id },
      });
    }

    // Return user data (without password)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        agency,
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
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
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
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as { userId: string };
    
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