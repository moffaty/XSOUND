const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Role = require('./roles');

// Определите модель пользователя
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role, // Модель, с которой устанавливается связь
      key: 'role_id' // Поле, с которым устанавливается связь
    }
  }
});

module.exports = User;
