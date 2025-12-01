module.exports = {
  apps: [{
    name: 'sjml',
    script: 'npm',
    args: 'start -- -p 1001',
    cwd: '/www/wwwroot/sjml',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--tls-min-v1.2',
      PORT: '1001'
    },
    error_file: '/root/.pm2/logs/sjml-error.log',
    out_file: '/root/.pm2/logs/sjml-out.log',
    time: true
  }]
}
