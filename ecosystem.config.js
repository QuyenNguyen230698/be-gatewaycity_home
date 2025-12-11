module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "server.js",
      cwd: "/var/www/api-gateway.gatewaycityvinhlong.vn",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
