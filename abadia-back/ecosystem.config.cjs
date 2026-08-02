module.exports = {
  apps: [
    {
      name: 'abadia-back',
      cwd: '/var/www/abadia-back',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'abadia-front',
      cwd: '/var/www/abadia-front',
      script: 'npm',
      args: 'start -- --port 3100 --hostname 127.0.0.1',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
