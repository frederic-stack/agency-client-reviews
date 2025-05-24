import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const router = Router();
const prisma = new PrismaClient();

// Simple auth helper
const getAuthenticatedUser = async (req: Request) => {
  try {
    let token: string | undefined;
    
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true, isSuspended: false },
    });

    return user;
  } catch {
    return null;
  }
};

// Review validation
const reviewValidation = [
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('content').isLength({ min: 10, max: 2000 }).withMessage('Review content must be 10-2000 characters'),
  body('projectType').notEmpty().withMessage('Project type is required'),
  body('budgetRange').isIn(['UNDER_5K', 'FIVE_TO_15K', 'FIFTEEN_TO_50K', 'FIFTY_TO_100K', 'OVER_100K']).withMessage('Valid budget range required'),
  body('overallRating').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be 1-5'),
  body('paymentRating').isInt({ min: 1, max: 5 }).withMessage('Payment rating must be 1-5'),
  body('communicationRating').isInt({ min: 1, max: 5 }).withMessage('Communication rating must be 1-5'),
  body('scopeRating').isInt({ min: 1, max: 5 }).withMessage('Scope rating must be 1-5'),
  body('creativeFreedomRating').isInt({ min: 1, max: 5 }).withMessage('Creative freedom rating must be 1-5'),
  body('timelinessRating').isInt({ min: 1, max: 5 }).withMessage('Timeliness rating must be 1-5'),
  body('projectStatus').isIn(['ONGOING', 'COMPLETED', 'CANCELED']).withMessage('Valid project status required'),
];

// Submit anonymous review
router.post('/', reviewValidation, asyncHandler(async (req: Request, res: Response) => {
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

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required to submit reviews',
        statusCode: 401,
      },
    });
  }

  const {
    clientId,
    title,
    content,
    projectType,
    budgetRange,
    overallRating,
    paymentRating,
    communicationRating,
    scopeRating,
    creativeFreedomRating,
    timelinessRating,
    projectStatus,
  } = req.body;

  try {
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Business/Client not found',
          statusCode: 404,
        },
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        title: title || null,
        content,
        projectType,
        budgetRange,
        overallRating: parseInt(overallRating),
        paymentRating: parseInt(paymentRating),
        communicationRating: parseInt(communicationRating),
        scopeRating: parseInt(scopeRating),
        creativeFreedomRating: parseInt(creativeFreedomRating),
        timelinessRating: parseInt(timelinessRating),
        projectStatus,
        userId: user.id, // Track reviewer (can be anonymous in display)
        clientId,
      },
    });

    // Update client aggregated ratings
    const avgRatings = await prisma.review.aggregate({
      where: { clientId, isPublic: true },
      _avg: {
        overallRating: true,
        paymentRating: true,
        communicationRating: true,
        scopeRating: true,
        creativeFreedomRating: true,
        timelinessRating: true,
      },
      _count: true,
    });

    await prisma.client.update({
      where: { id: clientId },
      data: {
        averageRating: avgRatings._avg.overallRating || 0,
        totalReviews: avgRatings._count,
        paymentRating: avgRatings._avg.paymentRating || 0,
        communicationRating: avgRatings._avg.communicationRating || 0,
        scopeRating: avgRatings._avg.scopeRating || 0,
        creativeFreedomRating: avgRatings._avg.creativeFreedomRating || 0,
        timelinessRating: avgRatings._avg.timelinessRating || 0,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        review: {
          id: review.id,
          anonymousId: review.anonymousId,
          title: review.title,
          content: review.content,
          projectType: review.projectType,
          budgetRange: review.budgetRange,
          overallRating: review.overallRating,
          paymentRating: review.paymentRating,
          communicationRating: review.communicationRating,
          scopeRating: review.scopeRating,
          creativeFreedomRating: review.creativeFreedomRating,
          timelinessRating: review.timelinessRating,
          projectStatus: review.projectStatus,
          createdAt: review.createdAt,
        },
      },
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during review submission',
        statusCode: 500,
      },
    });
  }
}));

// Get reviews for a specific business/client
router.get('/client/:clientId', asyncHandler(async (req: Request, res: Response) => {
  const { clientId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // Get client info
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Business/Client not found',
          statusCode: 404,
        },
      });
    }

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: {
        clientId,
        isPublic: true,
        moderationStatus: 'APPROVED',
      },
      select: {
        id: true,
        anonymousId: true,
        title: true,
        content: true,
        projectType: true,
        budgetRange: true,
        overallRating: true,
        paymentRating: true,
        communicationRating: true,
        scopeRating: true,
        creativeFreedomRating: true,
        timelinessRating: true,
        projectStatus: true,
        createdAt: true,
        // Don't include userId for anonymity
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Get total count
    const totalReviews = await prisma.review.count({
      where: {
        clientId,
        isPublic: true,
        moderationStatus: 'APPROVED',
      },
    });

    res.json({
      success: true,
      data: {
        client: {
          id: client.id,
          name: client.name,
          website: client.website,
          industry: client.industry,
          country: client.country,
          averageRating: client.averageRating,
          totalReviews: client.totalReviews,
          paymentRating: client.paymentRating,
          communicationRating: client.communicationRating,
          scopeRating: client.scopeRating,
          creativeFreedomRating: client.creativeFreedomRating,
          timelinessRating: client.timelinessRating,
        },
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNextPage: page < Math.ceil(totalReviews / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
}));

// Get all clients/businesses (for search)
router.get('/clients', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const industry = req.query.industry as string;
  const offset = (page - 1) * limit;

  try {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (industry) {
      where.industry = industry;
    }

    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        name: true,
        website: true,
        industry: true,
        country: true,
        description: true,
        averageRating: true,
        totalReviews: true,
        paymentRating: true,
        communicationRating: true,
        scopeRating: true,
        creativeFreedomRating: true,
        timelinessRating: true,
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalReviews: 'desc' },
      ],
      skip: offset,
      take: limit,
    });

    const totalClients = await prisma.client.count({ where });

    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalClients / limit),
          totalClients,
          hasNextPage: page < Math.ceil(totalClients / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
}));

// Status endpoint
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Review routes are working',
    routes: [
      'POST / - Submit anonymous review (auth required)',
      'GET /client/:clientId - Get reviews for a business',
      'GET /clients - Get all businesses (with search)',
    ],
  });
}));

export default router; 