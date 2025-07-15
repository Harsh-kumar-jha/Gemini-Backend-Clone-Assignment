module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/app.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'gemini-worker',
      script: 'dist/workers/geminiMessage.worker.js',
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env',
      cwd: __dirname,
    },
  ],
}; 