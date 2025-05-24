import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
}

// JWT Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Get token from cookie or Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
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

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };

    // Get user from database
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

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: 'CLIENT', // Default for now, will be updated after migration
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token has expired',
          statusCode: 401,
        },
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
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

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
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
        role: 'CLIENT', // Default for now
      };
    }

    next();
  } catch (error) {
    // Silently continue if optional auth fails
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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