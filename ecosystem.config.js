module.exports = {
    apps: [
      {
        name: "email-worker",
        script: "./worker.js",
        env: {
            NODE_ENV: "production",
            MONGO_URI: "mongodb://quyennc_user:quyen2019@14.225.204.233:27017/UserDatabase?authSource=UserDatabase",
            REDIS_URI: "redis://0.0.0.0:6379",
            REDIS_HOST: "0.0.0.0",
            REDIS_PORT: "6379",
            REDIS_PASSWORD: "tranduccorporation2024",
            EMAIL_HOST: "smtp.gmail.com",
            EMAIL_PORT: "587",
            EMAIL_USER: "quyen.nc.dev@gmail.com",
            EMAIL_PASS: "qcnppiifchigzcpj"
        }
      }
    ]
  };
  