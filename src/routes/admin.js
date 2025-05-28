const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTable,
  updateTable,
  deleteTable,
  getTables,
  getAllOrders,
  getDailySummary,
  getUsers,
  updateUser
} = require('../controllers/adminController');

/**
 * @swagger
 * /api/admin/tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Admin]
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
 *               - capacity
 *             properties:
 *               tableNumber:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Table created successfully
 */
router.post('/tables', protect, authorize('admin'), createTable);

/**
 * @swagger
 * /api/admin/tables/{id}:
 *   put:
 *     summary: Update a table
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               tableNumber:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               location:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Table updated successfully
 */
router.put('/tables/:id', protect, authorize('admin'), updateTable);

/**
 * @swagger
 * /api/admin/tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Table deleted successfully
 */
router.delete('/tables/:id', protect, authorize('admin'), deleteTable);

/**
 * @swagger
 * /api/admin/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tables
 */
router.get('/tables', protect, authorize('admin'), getTables);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/orders', protect, authorize('admin'), getAllOrders);

/**
 * @swagger
 * /api/admin/summary:
 *   get:
 *     summary: Get daily summary report
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Daily summary report
 */
router.get('/summary', protect, authorize('admin'), getDailySummary);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', protect, authorize('admin'), getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [frontdesk, backoffice, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 */
router.put('/users/:id', protect, authorize('admin'), updateUser);

module.exports = router; 