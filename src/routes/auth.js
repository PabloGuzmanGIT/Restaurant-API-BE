const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - companyName
 *         - ruc
 *         - email
 *         - userId
 *         - password
 *         - role
 *       properties:
 *         companyName:
 *           type: string
 *           description: Name of the company/restaurant
 *         ruc:
 *           type: string
 *           description: Company's RUC number
 *         email:
 *           type: string
 *           format: email
 *           description: Company's email address
 *         userId:
 *           type: string
 *           description: User's login ID
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [admin, frontdesk, backoffice]
 *           description: User's role in the system
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new company and admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Company and user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     companyId:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Validation error or duplicate entry
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     companyId:
 *                       type: string
 *                       format: uuid
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 */
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router; 