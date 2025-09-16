const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cacheClient = require("../services/cache.service");

const registerController = async (req, res) => {
  try {
    let { name, email, mobile, password } = req.body;

    let checkExistingUser = await UserModel.findOne({ email });

    if (checkExistingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    let hashedPass = await bcrypt.hash(password, 10);

    let newUser = await UserModel.create({
      name,
      email,
      mobile,
      password: hashedPass,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("ticket", token);

    return res.status(201).json({
      message: "User registered",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "All fields are required",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("ticket", token);

    return res.status(200).json({
      message: "User logged in",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.ticket;

    if (!token) {
      return res.status(401).json({
        message: "token not provided",
      });
    }

    await cacheClient.set(token, "blacklisted");

    res.clearCookie("ticket");

    return res.status(200).json({
      message: "User logged out",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};
