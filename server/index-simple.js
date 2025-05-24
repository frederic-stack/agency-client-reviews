const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://frontend-production-bd04.up.railway.app',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ClientScore API - Agencies & Freelancers Review Businesses',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// Simple endpoints without database
app.get('/api/clients', (req, res) => {
  res.json({
    success: true,
    data: {
      businesses: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        total: 0,
        hasNext: false,
        hasPrev: false
      }
    },
    message: 'No businesses found (database not connected)'
  });
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ClientScore API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CLIENT_URL || 'https://frontend-production-bd04.up.railway.app'}`);
}); 