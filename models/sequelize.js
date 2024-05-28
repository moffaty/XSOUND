const Sequelize = require('sequelize');

// Инициализируйте Sequelize с параметрами для SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    // disable logging; default: console.log
    logging: false,
    storage: 'database.sqlite', // Имя файла базы данных SQLite
});

module.exports = sequelize;
