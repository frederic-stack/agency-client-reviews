"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
router.get('/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
exports.default = router;
//# sourceMappingURL=admin.js.map