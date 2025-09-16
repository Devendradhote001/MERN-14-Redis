require("dotenv").config();
const express = require("express");
const {
  connectCacheService,
  cacheInstance,
} = require("./src/services/cache.service");

const app = express();

app.use(express.json());

connectCacheService();

let PORT = process.env.PORT || 4500;

app.post("/save-data", async (req, res) => {
  try {
    let { name, age, email } = req.body;

    await cacheInstance.setEx("user", 60, JSON.stringify(req.body));

    let savedUser = await cacheInstance.get("user");

    if (!savedUser)
      return res.status(400).json({
        message: "Bad request",
      });

    let parsedUser = JSON.parse(savedUser);

    return res.status(201).json({
      message: "User saved in redis",
      user: parsedUser,
    });
  } catch (error) {
    console.log("error in save data Api->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
