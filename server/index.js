const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS setup
app.use(cors({
  origin: [
    'https://front-end-github-production.up.railway.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ClientScore API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0'
    }
  });
});

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ClientScore API running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🌐 Test: https://back-end-github-production.up.railway.app/api/health`);
}); 