const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      userId: user.userId,
      role: user.role,
      companyId: user.companyId
    },
    'familiaguzman',
    { expiresIn: '24h' }
  );
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

exports.register = async (req, res) => {
  try {
    const { companyName, ruc, email, userId, password, role } = req.body;

    // Create company
    const company = await Company.create({
      companyName,
      ruc,
      email
    });

    // Create user
    const user = await User.create({
      userId,
      password,
      role,
      companyId: company.id
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.userId,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.userId,
        role: user.role,
        companyId: user.companyId
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 