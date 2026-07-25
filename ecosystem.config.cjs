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
        PORT: '3000',
        HOST: '127.0.0.1',
      },
    },
  ],
};
