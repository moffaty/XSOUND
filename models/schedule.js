const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Venue = require('./venue');

// Определите модель пользователя
const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Venue,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = Schedule;
