"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.createError = exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const errorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let isOperational = error.isOperational || false;
    logger_1.logger.error('Error occurred:', {
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
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        const errors = Object.values(error.errors || {}).map((err) => err.message);
        message = errors.join(', ');
        isOperational = true;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
        isOperational = true;
    }
    else if (error.code === '11000') {
        statusCode = 400;
        message = 'Duplicate field value entered';
        isOperational = true;
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
        isOperational = true;
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
        isOperational = true;
    }
    else if (error.name === 'PrismaClientKnownRequestError') {
        statusCode = 400;
        if (error.code === 'P2002') {
            message = 'Duplicate entry. A record with this information already exists.';
        }
        else if (error.code === 'P2025') {
            message = 'Record not found.';
            statusCode = 404;
        }
        else {
            message = 'Database error occurred.';
        }
        isOperational = true;
    }
    else if (error.name === 'PrismaClientValidationError') {
        statusCode = 400;
        message = 'Invalid data provided.';
        isOperational = true;
    }
    const errorResponse = {
        success: false,
        error: {
            message,
            statusCode,
            ...(config_1.config.NODE_ENV === 'development' && {
                stack: error.stack,
                details: error,
            }),
        },
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const createError = (message, statusCode = 500, isOperational = true) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = isOperational;
    return error;
};
exports.createError = createError;
const notFound = (req, res, next) => {
    const error = (0, exports.createError)(`Not found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
exports.default = exports.errorHandler;
//# sourceMappingURL=errorHandler.js.map