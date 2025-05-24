const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://frontend-production-bd04.up.railway.app',
  credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ClientScore API - Agencies & Freelancers Review Businesses',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// AUTH ROUTES

// Register agency/freelancer
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, companyName, industry = 'Other', country = 'Unknown', website = '' } = req.body;

    if (!email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and company name are required'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        companyName,
        websiteUrl: website,
        industry,
        country,
      }
    });

    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: { user: userWithoutPassword, token },
      message: 'Agency/Freelancer registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { user: userWithoutPassword, token },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: { reviews: true, bookmarks: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: { user: userWithoutPassword } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
});

// BUSINESS/CLIENT ROUTES

// Get all businesses
app.get('/api/clients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const industry = req.query.industry;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (industry) {
      where.industry = industry;
    }

    const businesses = await prisma.client.findMany({
      where,
      orderBy: [{ averageRating: 'desc' }, { totalReviews: 'desc' }],
      skip: offset,
      take: limit
    });

    const total = await prisma.client.count({ where });

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ success: false, message: 'Failed to get businesses' });
  }
});

// Create business
app.post('/api/clients', async (req, res) => {
  try {
    const { name, website, industry, country, description } = req.body;

    if (!name || !industry || !country) {
      return res.status(400).json({
        success: false,
        message: 'Name, industry, and country are required'
      });
    }

    const business = await prisma.client.create({
      data: { name, website, industry, country, description }
    });

    res.status(201).json({
      success: true,
      data: { business },
      message: 'Business created successfully'
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ success: false, message: 'Failed to create business' });
  }
});

// Get single business with reviews
app.get('/api/clients/:id', async (req, res) => {
  try {
    const business = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        reviews: {
          where: { isPublic: true },
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
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    res.json({ success: true, data: { business } });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ success: false, message: 'Failed to get business' });
  }
});

// REVIEW ROUTES

// Submit review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const {
      clientId, title, content, projectType, budgetRange,
      overallRating, paymentRating, communicationRating,
      scopeRating, creativeFreedomRating, timelinessRating,
      projectStatus
    } = req.body;

    // Validate required fields
    if (!clientId || !content || !projectType || !budgetRange || 
        !overallRating || !paymentRating || !communicationRating ||
        !scopeRating || !creativeFreedomRating || !timelinessRating || !projectStatus) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if business exists
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        title,
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
        userId: req.user.id,
        clientId
      }
    });

    // Update client ratings
    const avgRatings = await prisma.review.aggregate({
      where: { clientId, isPublic: true },
      _avg: {
        overallRating: true,
        paymentRating: true,
        communicationRating: true,
        scopeRating: true,
        creativeFreedomRating: true,
        timelinessRating: true
      },
      _count: true
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
        timelinessRating: avgRatings._avg.timelinessRating || 0
      }
    });

    const { userId: _, ...reviewWithoutUserId } = review;
    res.status(201).json({
      success: true,
      data: { review: reviewWithoutUserId },
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// Get reviews for a business
app.get('/api/reviews/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { clientId, isPublic: true },
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
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    });

    const total = await prisma.review.count({
      where: { clientId, isPublic: true }
    });

    res.json({
      success: true,
      data: {
        client,
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to get reviews' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 ClientScore API running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS Origin: ${process.env.CLIENT_URL || 'https://frontend-production-bd04.up.railway.app'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 