const mongoose = require("mongoose");

const DB_CONNECTION = async () => {
 try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
 } catch (error) {
  console.log(error);
  process.exit(1);
 }
};

module.exports = DB_CONNECTION;
