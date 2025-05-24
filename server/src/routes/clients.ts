import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Business validation
const businessValidation = [
  body('name').notEmpty().withMessage('Business name is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('country').notEmpty().withMessage('Country is required'),
];

// Create new business/client (for admin or agencies to add businesses they've worked with)
router.post('/', businessValidation, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
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

  const {
    name,
    website,
    industry,
    country,
    description,
  } = req.body;

  try {
    // Check if business already exists
    const existingBusiness = await prisma.client.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        industry,
      },
    });

    if (existingBusiness) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Business with this name and industry already exists',
          statusCode: 400,
        },
      });
      return;
    }

    // Create business
    const business = await prisma.client.create({
      data: {
        name,
        website: website || null,
        industry,
        country,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        business,
      },
      message: 'Business created successfully',
    });
  } catch (error) {
    console.error('Business creation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during business creation',
        statusCode: 500,
      },
    });
  }
}));

// Get single business/client with reviews
router.get('/:id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const business = await prisma.client.findUnique({
      where: { id },
      include: {
        reviews: {
          where: {
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
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 reviews
        },
        _count: {
          select: {
            reviews: {
              where: {
                isPublic: true,
                moderationStatus: 'APPROVED',
              },
            },
          },
        },
      },
    });

    if (!business) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Business not found',
          statusCode: 404,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        business,
      },
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        statusCode: 500,
      },
    });
  }
}));

// Search businesses
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const industry = req.query.industry as string;
  const country = req.query.country as string;
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
    
    if (country) {
      where.country = country;
    }

    const businesses = await prisma.client.findMany({
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
        createdAt: true,
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalReviews: 'desc' },
        { name: 'asc' },
      ],
      skip: offset,
      take: limit,
    });

    const totalBusinesses = await prisma.client.count({ where });

    // Get unique industries and countries for filtering
    const industries = await prisma.client.findMany({
      select: { industry: true },
      distinct: ['industry'],
      orderBy: { industry: 'asc' },
    });

    const countries = await prisma.client.findMany({
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });

    res.json({
      success: true,
      data: {
        businesses,
        filters: {
          industries: industries.map(i => i.industry),
          countries: countries.map(c => c.country),
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalBusinesses / limit),
          totalBusinesses,
          hasNextPage: page < Math.ceil(totalBusinesses / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Search businesses error:', error);
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
router.get('/status', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Client routes are working',
    routes: [
      'POST / - Create new business',
      'GET / - Search/list businesses',
      'GET /:id - Get single business with reviews',
    ],
  });
}));

export default router; 