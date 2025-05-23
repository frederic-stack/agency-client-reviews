import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Basic route placeholder
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router; 