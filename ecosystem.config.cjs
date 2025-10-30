// PM2 Ecosystem Configuration File
// This file is used to configure PM2 for production deployment
// Usage: pm2 start ecosystem.config.cjs --env production

module.exports = {
  apps: [
    {
      name: 'connect-job-world-api',
      script: './server/server.js',
      instances: 'max', // Use all available CPU cores (cluster mode)
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Auto-restart configuration
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,

      // Watch and restart on file changes (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],

      // Environment files
      env_file: '.env',

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Cron restart (optional - restart at 3 AM every day)
      // cron_restart: '0 3 * * *',

      // Source map support
      source_map_support: true,

      // Node.js arguments
      node_args: '--max-old-space-size=4096',
    },
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/connect-job-world.git',
      path: '/var/www/connect-job-world',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': '',
    },
  },
};
