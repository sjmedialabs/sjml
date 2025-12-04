module.exports = {
  apps: [
    {
      name: "sjml-app",
      script: "npm",
      args: "start -- -p 1002",
      cwd: "/www/wwwroot/sjml",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--tls-min-v1.2",
        PORT: "1002",
        MONGODB_URI: "mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs",
      },
      error_file: "/root/.pm2/logs/sjml-app-error.log",
      out_file: "/root/.pm2/logs/sjml-app-out.log",
      time: true,
    },
  ],
};
