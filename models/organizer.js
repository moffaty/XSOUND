const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user');
const Venue = require('./venue');

const Organizer = sequelize.define('Organizer', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User, // Модель, с которой устанавливается связь
          key: 'id' // Поле, с которым устанавливается связь
        }
    },
    organizer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Venue, // Модель, с которой устанавливается связь
          key: 'id' // Поле, с которым устанавливается связь
        }
    },  
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})


module.exports = Organizer;