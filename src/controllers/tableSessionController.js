const TableSession = require('../models/TableSession');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { Op } = require('sequelize');

// Open a new table session
exports.openTableSession = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const companyId = req.user.companyId;

    // Check if table is already open
    const existingSession = await TableSession.findOne({
      where: {
        tableNumber,
        companyId,
        status: 'open'
      }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        error: 'Table is already in use'
      });
    }

    const session = await TableSession.create({
      tableNumber,
      companyId,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Close a table session
exports.closeTableSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const companyId = req.user.companyId;

    const session = await TableSession.findOne({
      where: {
        id: sessionId,
        companyId,
        status: 'open'
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Table session not found or already closed'
      });
    }

    // Calculate total amount from orders
    const orders = await Order.findAll({
      where: { tableSessionId: sessionId }
    });

    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    // Update session
    await session.update({
      status: 'closed',
      endTime: new Date(),
      totalAmount
    });

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Add order to table session
exports.addOrder = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { menuItemId, quantity, notes } = req.body;
    const companyId = req.user.companyId;

    // Check if session exists and is open
    const session = await TableSession.findOne({
      where: {
        id: sessionId,
        companyId,
        status: 'open'
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Table session not found or closed'
      });
    }

    // Get menu item
    const menuItem = await MenuItem.findOne({
      where: {
        id: menuItemId,
        isAvailable: true
      }
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found or not available'
      });
    }

    // Create order
    const order = await Order.create({
      tableSessionId: sessionId,
      menuItemId,
      quantity,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * quantity,
      notes
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get table session details
exports.getTableSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const companyId = req.user.companyId;

    const session = await TableSession.findOne({
      where: {
        id: sessionId,
        companyId
      },
      include: [{
        model: Order,
        include: [{
          model: MenuItem
        }]
      }]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Table session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 