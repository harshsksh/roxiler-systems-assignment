const { Client } = require('pg');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing PostgreSQL connection...');
  
  // Try different connection methods
  const connectionConfigs = [
    {
      name: 'Password Authentication',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: 'postgres'
      }
    },
    {
      name: 'Windows Authentication',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        database: 'postgres'
      }
    },
    {
      name: 'Default Connection',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres'
      }
    }
  ];

  for (const { name, config } of connectionConfigs) {
    console.log(`\n📡 Trying ${name}...`);
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log(`✅ ${name} - Connection successful!`);
      
      // Test if we can create database
      const dbName = process.env.DB_NAME || 'store_rating_db';
      const result = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );
      
      if (result.rows.length === 0) {
        console.log(`📦 Creating database: ${dbName}`);
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database ${dbName} created successfully`);
      } else {
        console.log(`✅ Database ${dbName} already exists`);
      }
      
      await client.end();
      console.log(`🎉 ${name} - Setup completed successfully!`);
      return true;
      
    } catch (error) {
      console.log(`❌ ${name} - Failed: ${error.message}`);
      await client.end().catch(() => {});
    }
  }
  
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure PostgreSQL service is running');
  console.log('2. Check if PostgreSQL is installed correctly');
  console.log('3. Try connecting with pgAdmin or psql command line');
  console.log('4. Check PostgreSQL configuration in pg_hba.conf');
  console.log('5. Reset postgres user password if needed');
  
  return false;
};

testConnection();
