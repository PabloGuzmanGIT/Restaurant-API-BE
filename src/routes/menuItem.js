const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuItemController');

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         isAvailable:
 *           type: boolean
 */

/**
 * @swagger
 * /api/menu-items:
 *   get:
 *     summary: Get all available menu items
 *     tags: [Menu Items]
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 */
router.get('/', getMenuItems);

/**
 * @swagger
 * /api/menu-items:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', protect, authorize('admin'), createMenuItem);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu Items]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 */
router.put('/:id', protect, authorize('admin'), updateMenuItem);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Delete a menu item (soft delete)
 *     tags: [Menu Items]
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
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router; 