const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tableSessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TableSessions',
      key: 'id'
    }
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'MenuItems',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Order; 