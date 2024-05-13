const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// Определите модель роли
const Status = sequelize.define('Status', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Status;
