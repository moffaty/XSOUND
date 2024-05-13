const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Genre = sequelize.define('Genre', {
    genre_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    genre_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Genre;