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
app.use(cors());
app.use(morgan("dev"));

// Routes
const routes = require("./src/routes");
app.use("/api", routes);

// Đảm bảo Express sử dụng đúng thư mục views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

module.exports = app;
