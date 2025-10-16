#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const quickStart = async () => {
  console.log('🚀 Quick Start - Store Rating System\n');
  
  try {
    // Kill existing Node.js processes
    console.log('🔄 Cleaning up existing processes...');
    try {
      await execAsync('taskkill /IM node.exe /F');
      console.log('✅ Existing Node.js processes killed');
    } catch (error) {
      console.log('ℹ️  No existing Node.js processes to kill');
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n🔄 Starting application...');
    console.log('📱 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5000');
    console.log('🔑 Admin: admin@roxiler.com / Admin@123');
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Application starting...');
    console.log('='.repeat(50) + '\n');
    
    // Start the application
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    // Handle termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      child.kill('SIGINT');
      process.exit(0);
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
};

quickStart();
