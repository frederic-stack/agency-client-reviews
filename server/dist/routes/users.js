"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
router.get('/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
exports.default = router;
//# sourceMappingURL=users.js.map