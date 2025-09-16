const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const cacheClient = require("../services/cache.service");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.ticket;

    if (!token) {
      return res.status(404).json({
        message: "Token not found, Unauthorized",
      });
    }

    let isBlackListed = await cacheClient.get(token);

    if (isBlackListed) {
      return res.status(401).json({
        message: "Token blacklisted",
      });
    }

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    let user = await UserModel.findById(decode.id);

    req.user = user;
    next();
  } catch (error) {
    console.log("error in middleware", error);
  }
};

module.exports = authMiddleware;
