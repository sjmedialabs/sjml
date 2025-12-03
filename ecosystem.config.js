module.exports = {
  apps: [
    // Frontend - Marketing Pages (ISR)
    {
      name: "sjml-frontend",
      script: "npm",
      args: "start -- -p 1002",
      cwd: "/www/wwwroot/sjml",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--tls-min-v1.2",
        PORT: "1002",
      },
      error_file: "/root/.pm2/logs/sjml-frontend-error.log",
      out_file: "/root/.pm2/logs/sjml-frontend-out.log",
      time: true,
    },
    // Backend - Admin + API (Dynamic)
    {
      name: "sjml-backend",
      script: "npm",
      args: "start -- -p 1001",
      cwd: "/www/wwwroot/sjml",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--tls-min-v1.2",
        PORT: "1001",
      },
      error_file: "/root/.pm2/logs/sjml-backend-error.log",
      out_file: "/root/.pm2/logs/sjml-backend-out.log",
      time: true,
    },
  ],
};
