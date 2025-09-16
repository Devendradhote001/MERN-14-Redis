const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let res = await mongoose.connect("mongodb://0.0.0.0/anime");
    if (res) {
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.log("error in connecting mongodb", error);
  }
};

module.exports = connectDB;
