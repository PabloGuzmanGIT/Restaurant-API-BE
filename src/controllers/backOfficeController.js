const TableSession = require('../models/TableSession');
const Order = require('../models/Order');
const { Op } = require('sequelize');

// Get all active table sessions with their orders
exports.getActiveTableSessions = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const sessions = await TableSession.findAll({
      where: {
        companyId,
        status: 'open'
      },
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

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const companyId = req.user.companyId;

    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'served'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    // Find order and verify it belongs to the company
    const order = await Order.findOne({
      include: [{
        model: TableSession,
        where: { companyId }
      }],
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order status
    await order.update({ status });

    res.json({
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