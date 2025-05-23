import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

// Custom error interface
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  path?: string;
  value?: any;
  errors?: any;
}

// Error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let isOperational = error.isOperational || false;

  // Log error details
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    const errors = Object.values(error.errors || {}).map((err: any) => err.message);
    message = errors.join(', ');
    isOperational = true;
  } else if (error.name === 'CastError') {
    // Mongoose cast error
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
    isOperational = true;
  } else if (error.code === '11000') {
    // MongoDB duplicate key error
    statusCode = 400;
    message = 'Duplicate field value entered';
    isOperational = true;
  } else if (error.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  } else if (error.name === 'TokenExpiredError') {
    // JWT expired error
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    isOperational = true;
  } else if (error.name === 'PrismaClientKnownRequestError') {
    // Prisma known error
    statusCode = 400;
    if (error.code === 'P2002') {
      message = 'Duplicate entry. A record with this information already exists.';
    } else if (error.code === 'P2025') {
      message = 'Record not found.';
      statusCode = 404;
    } else {
      message = 'Database error occurred.';
    }
    isOperational = true;
  } else if (error.name === 'PrismaClientValidationError') {
    // Prisma validation error
    statusCode = 400;
    message = 'Invalid data provided.';
    isOperational = true;
  }

  // Response object
  const errorResponse: any = {
    success: false,
    error: {
      message,
      statusCode,
      ...(config.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error,
      }),
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create operational error
export const createError = (
  message: string,
  statusCode: number = 500,
  isOperational: boolean = true
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

export default errorHandler; 