module.exports = {
  apps: [
    {
      name: "jomorais-frontend",
      cwd: __dirname,
      script: "npm",
      args: "start",
      watch: false,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
