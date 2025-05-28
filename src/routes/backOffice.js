const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getActiveTableSessions,
  updateOrderStatus
} = require('../controllers/backOfficeController');

/**
 * @swagger
 * /api/backoffice/table-sessions:
 *   get:
 *     summary: Get all active table sessions with their orders
 *     tags: [Back Office]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active table sessions
 */
router.get('/table-sessions', protect, authorize('backoffice', 'admin'), getActiveTableSessions);

/**
 * @swagger
 * /api/backoffice/orders/{orderId}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Back Office]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, served]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.put('/orders/:orderId/status', protect, authorize('backoffice', 'admin'), updateOrderStatus);

module.exports = router; 