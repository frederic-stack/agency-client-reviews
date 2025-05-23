import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
// Import controllers when created
// import * as authController from '../controllers/authController';

const router = Router();

// Basic route placeholder - will be implemented with controllers
router.get('/status', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router; 