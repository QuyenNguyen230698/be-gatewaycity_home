module.exports = {
    apps: [
      {
        name: "email-worker",
        script: "./worker.js",
        env: {
            NODE_ENV: "production",
            MONGO_URI: "mongodb://gatewaycity_user:gwchwebdev2025@127.0.0.1:27017/gatewaycity_db?authSource=gatewaycity_db",
            EMAIL_HOST: "smtp.gmail.com",
            EMAIL_PORT: "587",
            EMAIL_USER: "gatewaycityvinhlong@gmail.com",
            EMAIL_PASS: "phxekquafbvdhqwl"
        }
      }
    ]
  };
  