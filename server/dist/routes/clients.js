"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const businessValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Business name is required'),
    (0, express_validator_1.body)('industry').notEmpty().withMessage('Industry is required'),
    (0, express_validator_1.body)('country').notEmpty().withMessage('Country is required'),
];
router.post('/', businessValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
    const { name, website, industry, country, description, } = req.body;
    try {
        const existingBusiness = await prisma.client.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' },
                industry,
            },
        });
        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Business with this name and industry already exists',
                    statusCode: 400,
                },
            });
        }
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
    }
    catch (error) {
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
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
                    take: 5,
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
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Business not found',
                    statusCode: 404,
                },
            });
        }
        res.json({
            success: true,
            data: {
                business,
            },
        });
    }
    catch (error) {
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
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const industry = req.query.industry;
    const country = req.query.country;
    const offset = (page - 1) * limit;
    try {
        const where = {};
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
    }
    catch (error) {
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
router.get('/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
exports.default = router;
//# sourceMappingURL=clients.js.map