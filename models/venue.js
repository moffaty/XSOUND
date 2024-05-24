const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Organizer = require('./organizer');

const Venue = sequelize.define('Venue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    info: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    organizer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Organizer, // Модель, с которой устанавливается связь
            key: 'id', // Поле, с которым устанавливается связь
        },
    },
});

module.exports = Venue;
