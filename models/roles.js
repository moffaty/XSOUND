const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// Определите модель роли
const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Role;
