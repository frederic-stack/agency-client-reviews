import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Basic route placeholder
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router; 