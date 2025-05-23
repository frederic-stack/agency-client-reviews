import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Basic route placeholder
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router; 