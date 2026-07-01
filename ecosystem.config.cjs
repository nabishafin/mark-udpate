module.exports = {
  apps: [
    {
      name: 'mdrnlifeddw',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
  ],
};
