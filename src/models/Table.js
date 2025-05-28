const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
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

module.exports = Table; 