const Table = require('../models/Table');
const TableSession = require('../models/TableSession');
const Order = require('../models/Order');
const User = require('../models/User');
const { Op } = require('sequelize');

// Table Management
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location } = req.body;
    const companyId = req.user.companyId;

    const table = await Table.create({
      tableNumber,
      capacity,
      location,
      companyId
    });

    res.status(201).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, isActive } = req.body;
    const companyId = req.user.companyId;

    const table = await Table.findOne({
      where: {
        id,
        companyId
      }
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    await table.update({
      tableNumber,
      capacity,
      location,
      isActive
    });

    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const table = await Table.findOne({
      where: {
        id,
        companyId
      }
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    await table.update({ isActive: false });

    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getTables = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const tables = await Table.findAll({
      where: {
        companyId,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Order Management
exports.getAllOrders = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { startDate, endDate } = req.query;

    const whereClause = {
      companyId
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const sessions = await TableSession.findAll({
      where: whereClause,
      include: [{
        model: Order,
        include: [{
          model: require('../models/MenuItem')
        }]
      }]
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Daily Summary Report
exports.getDailySummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sessions = await TableSession.findAll({
      where: {
        companyId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [{
        model: Order,
        include: [{
          model: require('../models/MenuItem')
        }]
      }]
    });

    // Calculate summary
    const summary = {
      totalSessions: sessions.length,
      totalOrders: sessions.reduce((sum, session) => sum + session.Orders.length, 0),
      totalRevenue: sessions.reduce((sum, session) => sum + parseFloat(session.totalAmount), 0),
      averageOrderValue: 0,
      ordersByStatus: {
        pending: 0,
        preparing: 0,
        ready: 0,
        served: 0
      }
    };

    // Calculate orders by status
    sessions.forEach(session => {
      session.Orders.forEach(order => {
        summary.ordersByStatus[order.status]++;
      });
    });

    // Calculate average order value
    if (summary.totalOrders > 0) {
      summary.averageOrderValue = summary.totalRevenue / summary.totalOrders;
    }

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// User Management
exports.getUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const users = await User.findAll({
      where: { companyId },
      attributes: ['id', 'userId', 'role', 'createdAt']
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const companyId = req.user.companyId;

    const user = await User.findOne({
      where: {
        id,
        companyId
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.update({ role });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 