const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });


const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // For SQLite, we need to sync in the correct order to avoid foreign key issues
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
    
    // Add unique constraint after tables are created
    try {
      await sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS ratings_user_id_store_id 
        ON ratings (userId, storeId)
      `);
      console.log('Unique constraint added to ratings table');
    } catch (error) {
      // Index might already exist, that's okay
      console.log('Unique constraint already exists or failed to create');
    }
    
    const adminExists = await User.findOne({ where: { role: 'system_admin' } });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@roxiler.com',
        password: 'Admin@123',
        address: 'System Administration Office, Roxiler Systems',
        role: 'system_admin'
      });
      console.log('Default admin user created: admin@roxiler.com / Admin@123');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncDatabase
};
