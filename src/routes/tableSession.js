const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  openTableSession,
  closeTableSession,
  addOrder,
  getTableSession
} = require('../controllers/tableSessionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TableSession:
 *       type: object
 *       required:
 *         - tableNumber
 *         - companyId
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tableNumber:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [open, closed]
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         totalAmount:
 *           type: number
 *         companyId:
 *           type: string
 *           format: uuid
 *         createdBy:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /api/table-sessions:
 *   post:
 *     summary: Open a new table session
 *     tags: [Table Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableNumber
 *             properties:
 *               tableNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Table session created successfully
 *       400:
 *         description: Invalid input or table already in use
 */
router.post('/', protect, authorize('frontdesk', 'admin'), openTableSession);

/**
 * @swagger
 * /api/table-sessions/{sessionId}:
 *   get:
 *     summary: Get table session details
 *     tags: [Table Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Table session details retrieved successfully
 *       404:
 *         description: Table session not found
 */
router.get('/:sessionId', protect, authorize('frontdesk', 'admin'), getTableSession);

/**
 * @swagger
 * /api/table-sessions/{sessionId}/close:
 *   post:
 *     summary: Close a table session
 *     tags: [Table Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Table session closed successfully
 *       404:
 *         description: Table session not found or already closed
 */
router.post('/:sessionId/close', protect, authorize('frontdesk', 'admin'), closeTableSession);

/**
 * @swagger
 * /api/table-sessions/{sessionId}/orders:
 *   post:
 *     summary: Add an order to a table session
 *     tags: [Table Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
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
 *               - menuItemId
 *               - quantity
 *             properties:
 *               menuItemId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order added successfully
 *       404:
 *         description: Table session or menu item not found
 */
router.post('/:sessionId/orders', protect, authorize('frontdesk', 'admin'), addOrder);

module.exports = router; 