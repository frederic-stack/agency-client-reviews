const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ClientScore API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'development',
      version: '1.0.0',
      services: {
        database: { status: 'not connected', type: 'PostgreSQL' },
        redis: { status: 'not connected', type: 'Redis' },
      },
    },
  });
});

// Auth routes
app.get('/api/auth/status', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working',
    routes: [
      'POST /register - Register new agency/vendor',
      'POST /login - Login with email/password',
      'POST /logout - Logout user',
      'POST /verify-email - Verify email address',
      'POST /resend-verification - Resend verification email',
      'POST /forgot-password - Request password reset',
      'POST /reset-password - Reset password',
      'GET /google - Google OAuth login',
      'GET /google/callback - Google OAuth callback',
      'GET /linkedin - LinkedIn OAuth login',
      'GET /linkedin/callback - LinkedIn OAuth callback',
      'POST /refresh-token - Refresh JWT token',
    ],
  });
});

// User routes
app.get('/api/users/status', (req, res) => {
  res.json({
    success: true,
    message: 'User routes are working',
    routes: [
      'GET /profile - Get user profile',
      'PUT /profile - Update user profile',
      'DELETE /profile - Delete user account',
      'GET /notifications - Get user notifications',
      'PUT /notifications/:id/read - Mark notification as read',
      'GET /bookmarks - Get bookmarked clients',
      'POST /bookmarks - Add client bookmark',
      'DELETE /bookmarks/:clientId - Remove client bookmark',
    ],
  });
});

// Client routes
app.get('/api/clients/status', (req, res) => {
  res.json({
    success: true,
    message: 'Client routes are working',
    routes: [
      'GET / - Search and list clients',
      'GET /:id - Get client profile',
      'POST / - Create new client (admin only)',
      'PUT /:id - Update client info (admin only)',
      'DELETE /:id - Delete client (admin only)',
      'GET /:id/reviews - Get client reviews',
      'GET /:id/stats - Get client statistics',
      'POST /:id/bookmark - Bookmark client',
      'DELETE /:id/bookmark - Remove bookmark',
    ],
  });
});

// Review routes
app.get('/api/reviews/status', (req, res) => {
  res.json({
    success: true,
    message: 'Review routes are working',
    routes: [
      'GET / - Get all reviews (with filters)',
      'GET /:id - Get specific review',
      'POST / - Submit new review',
      'PUT /:id - Update review (author only)',
      'DELETE /:id - Delete review (author only)',
      'POST /:id/report - Report review for moderation',
      'GET /feed - Get personalized review feed',
      'GET /client/:clientId - Get reviews for specific client',
    ],
  });
});

// Admin routes
app.get('/api/admin/status', (req, res) => {
  res.json({
    success: true,
    message: 'Admin routes are working',
    routes: [
      'GET /dashboard - Admin dashboard stats',
      'GET /users - Get all users',
      'PUT /users/:id/verify - Verify user account',
      'PUT /users/:id/suspend - Suspend user account',
      'GET /reviews/pending - Get reviews pending moderation',
      'PUT /reviews/:id/moderate - Moderate review',
      'GET /reports - Get moderation reports',
      'PUT /reports/:id/resolve - Resolve moderation report',
      'GET /clients - Get all clients',
      'POST /clients - Create new client',
      'PUT /clients/:id - Update client info',
      'DELETE /clients/:id - Delete client',
    ],
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ClientScore API server running on port ${PORT}`);
  console.log(`📚 Environment: development`);
  console.log(`🗄️  Database: Not connected (testing mode)`);
  console.log(`🔴 Redis: Not connected (testing mode)`);
  console.log(`✅ Server ready for testing!`);
}); 