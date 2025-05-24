import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { verifyToken } from '../utils/jwt';

const prisma = new PrismaClient();

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    companyName?: string;
  };
}

// JWT Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from cookie or Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
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

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
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

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      companyName: user.companyName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token has expired',
          statusCode: 401,
        },
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
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

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      next();
      return;
    }

    const decoded = verifyToken(token);
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
  } catch (error) {
    // Silently continue if optional auth fails
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

    // For now, all authenticated users are considered valid
    // This can be extended when role system is implemented
    next();
  };
}; 