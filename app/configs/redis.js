const Queue = require("bull");

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    password: process.env.REDIS_PASSWORD || "tranduccorporation2024", // Thêm password nếu Redis yêu cầu
  },
});

emailQueue.on("error", (err) => {
  console.error("Redis Error:", err);
});

module.exports = emailQueue;
