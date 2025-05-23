import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Basic route placeholder
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router; 