const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./configs/database");
const path = require("path");

require("dotenv").config();

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://admin.gatewaycityvinhlong.vn",
      "https://gatewaycityvinhlong.vn",
      "https://www.gatewaycityvinhlong.vn",
      // Nếu bạn dev local thì thêm tạm cái này (sau này xóa cũng được)
      "http://localhost:4000",
      "http://127.0.0.1:4000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
    credentials: true, // rất quan trọng nếu bạn dùng cookie/session/JWT trong header
  })
);

// Xử lý pre-flight OPTIONS cho tất cả route (bắt buộc có)
app.options("*", cors());

app.use(morgan("dev"));

// Routes
const routes = require("./src/routes.js");
app.use("/api", routes);

// Đảm bảo Express sử dụng đúng thư mục views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

module.exports = app;
