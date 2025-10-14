const { Sequelize } = require('sequelize');
require('dotenv').config();

// SQLite configuration for development/testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
});

module.exports = sequelize;
