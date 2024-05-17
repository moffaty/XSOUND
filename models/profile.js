const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user');

// Определите модель пользователя
const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Модель, с которой устанавливается связь
            key: 'id', // Поле, с которым устанавливается связь
        },
    },
});

module.exports = Profile;
