const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Chat;
