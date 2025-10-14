const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if we should use SQLite (for development when PostgreSQL is not available)
const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.DB_PASSWORD;

let sequelize;

if (useSQLite) {
  console.log('📦 Using SQLite database for development');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  console.log('🐘 Using PostgreSQL database');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'store_rating_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;
