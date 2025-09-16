require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./src/config/db/db");
const authRoutes = require("./src/routes/user.routes");
const cacheClient = require("./src/services/cache.service");

connectDB();

cacheClient.on("connect", () => {
  console.log("Redis connected successfully");
});

cacheClient.on("error", (error) => {
  console.log("error in redis", error);
});

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

let PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
