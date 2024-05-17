const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Chat = require('./chat');

const Message = sequelize.define('Message', {
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
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Chat,
            key: 'id',
        },
    },
    message: {
        type: DataTypes.TEXT, // Используйте TEXT для хранения более длинных сообщений
        allowNull: false,
    },
});

module.exports = Message;
