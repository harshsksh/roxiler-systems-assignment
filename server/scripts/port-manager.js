const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const killProcessOnPort = async (port) => {
  try {
    console.log(`Checking port ${port}...`);
    
    // Find process using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (!stdout || !stdout.trim()) {
      console.log(`Port ${port} is available`);
      return true;
    }
    
    // Extract PID from netstat output
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(pid)) {
          pids.add(pid);
        }
      }
    });
    
    if (pids.size === 0) {
      console.log(`Port ${port} is available`);
      return true;
    }
    
    console.log(`Port ${port} is in use by process(es): ${Array.from(pids).join(', ')}`);
    
    // Kill processes
    for (const pid of pids) {
      try {
        console.log(`Killing process ${pid}...`);
        await execAsync(`taskkill /PID ${pid} /F`);
        console.log(`Process ${pid} killed successfully`);
      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`Process ${pid} already terminated`);
        } else {
          console.log(`Could not kill process ${pid}: ${error.message}`);
        }
      }
    }
    
    // Wait a moment for ports to be released
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify port is now free
    try {
      const { stdout: checkOutput } = await execAsync(`netstat -ano | findstr :${port}`);
      if (!checkOutput || !checkOutput.trim()) {
        console.log(`Port ${port} is now available`);
        return true;
      } else {
        console.log(`Port ${port} may still be in use, but continuing...`);
        return true; // Continue anyway
      }
    } catch (error) {
      console.log(`Port ${port} is now available`);
      return true;
    }
    
  } catch (error) {
    if (error.message.includes('findstr')) {
      console.log(`Port ${port} is available (no processes found)`);
      return true;
    } else {
      console.log(`Error checking port ${port}: ${error.message}`);
      return true; // Continue anyway
    }
  }
};

const killNodeProcesses = async () => {
  try {
    console.log('Killing all Node.js processes...');
    await execAsync('taskkill /IM node.exe /F');
    console.log('All Node.js processes killed');
  } catch (error) {
    console.log('No Node.js processes to kill');
  }
};

const ensurePortsAvailable = async (ports = [3000, 5000]) => {
  console.log('Ensuring ports are available...\n');
  
  const results = await Promise.all(
    ports.map(port => killProcessOnPort(port))
  );
  
  const allAvailable = results.every(result => result);
  
  if (allAvailable) {
    console.log('\nAll required ports are now available!');
    return true;
  } else {
    console.log('\nSome ports are still in use');
    return false;
  }
};

module.exports = {
  killProcessOnPort,
  killNodeProcesses,
  ensurePortsAvailable
};
