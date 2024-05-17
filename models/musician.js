const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user');
const Genre = require('./genre');

const Musician = sequelize.define('Musician', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Модель, с которой устанавливается связь
            key: 'id', // Поле, с которым устанавливается связь
        },
    },
    musician_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Genre, // Модель, с которой устанавливается связь
            key: 'genre_id', // Поле, с которым устанавливается связь
        },
    },
    repertoire: {
        type: DataTypes.JSON,
        allowNull: true,
    },
});

module.exports = Musician;
