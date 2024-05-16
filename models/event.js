const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Status = require('./eventStatus');
const Venue = require('./venue');

// Определите модель пользователя
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  venue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venue,
      key: 'id',
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Status, // Модель, с которой устанавливается связь
      key: 'status_id' // Поле, с которым устанавливается связь
    }
  }
});


module.exports = Event;
