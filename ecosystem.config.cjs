module.exports = {
  apps: [
    {
      name: 'mdrnlifeddw',
      script: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '350M',
      kill_timeout: 10000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        // Port 3000 is occupied by the legacy backend on the current VPS.
        // Keep this service loopback-only and route nginx to port 3001.
        PORT: '3001',
        HOST: '127.0.0.1',
      },
    },
  ],
};
