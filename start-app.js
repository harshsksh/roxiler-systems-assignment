#!/usr/bin/env node

const { exec } = require('child_process');
const { ensurePortsAvailable, killNodeProcesses } = require('./server/scripts/port-manager');
const util = require('util');
const execAsync = util.promisify(exec);

const startApplication = async () => {
  console.log('🚀 Starting Store Rating System...\n');
  
  try {
    // Step 1: Kill existing Node.js processes
    console.log('🔄 Step 1: Cleaning up existing processes...');
    try {
      await killNodeProcesses();
    } catch (error) {
      console.log('ℹ️  No existing Node.js processes to kill');
    }
    console.log('');
    
    // Step 2: Ensure ports are available
    console.log('🔄 Step 2: Checking and freeing up ports...');
    try {
      const portsAvailable = await ensurePortsAvailable([3000, 5000]);
      if (!portsAvailable) {
        console.log('⚠️  Some ports may still be in use, but continuing...');
      }
    } catch (error) {
      console.log('⚠️  Port check failed, but continuing...');
    }
    
    console.log('');
    
    // Step 3: Start the application
    console.log('🔄 Step 3: Starting the application...');
    console.log('📱 Frontend will be available at: http://localhost:3000');
    console.log('🔧 Backend API will be available at: http://localhost:5000');
    console.log('🔑 Default admin login: admin@roxiler.com / Admin@123');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Application is starting...');
    console.log('='.repeat(60) + '\n');
    
    // Start the application using concurrently
    const child = exec('npm run dev', {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down application...');
      if (child) {
        child.kill('SIGINT');
      }
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down application...');
      if (child) {
        child.kill('SIGTERM');
      }
      process.exit(0);
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Application exited with code ${code}`);
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startApplication();
