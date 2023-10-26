const express = require("express");
const {
 userContractInstance,
 votingContractInstance,
} = require("../configuration.js");
const jwt = require("jsonwebtoken");
const { userObjectMapper } = require("../utils/mappers.js");
const { authenticate, isOwner } = require("../middleware/authenticate.js");
const router = express.Router();
router.post("/login", async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  const { userID, password } = req.body;
  if (!userID || !password)
   return res.status(400).json({ message: "Username and password required" });
  const response = await userContractInstance.login(userID, password);
  const user = await userObjectMapper(response);
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
   expiresIn: "1h",
  });

  return res
   .cookie("token", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
   })
   .json({
    message: "Login successful",
    user,
   });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/signup", async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  const {
   firstname,
   lastname,
   userID,
   age,
   password,
   houseaddress,
   gender,
   email,
   aadhaarNumber,
   imageUrl,
   voterConstituency,
  } = req.body;
  if (
   !firstname ||
   !lastname ||
   !userID ||
   !password ||
   !aadhaarNumber ||
   !imageUrl ||
   !voterConstituency ||
   !age ||
   !houseaddress ||
   !gender ||
   !email
  )
   return res.status(400).json({ message: "All fields are required" });

  const response = await userContractInstance.signUp(
   firstname,
   lastname,
   userID,
   age,
   password,
   houseaddress,
   gender,
   email,
   aadhaarNumber,
   imageUrl,
   voterConstituency
  );

  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
   expiresIn: "1h",
  });

  res
   .cookie("token", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
   })
   .json({ message: "user created successfully" });
 } catch (error) {
  console.log(error);
  res.status(404).json({ message: error.message });
 }
});

router.post("/logout", (req, res) => {
 res.clearCookie("token").json({ message: "Logged out successfully" });
});

router.post("/getUser", authenticate, async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  const userID = req.userID;
  console.log(userID);
  if (!userID) return res.status(400).json({ message: "User ID required" });
  const response = await userContractInstance?.getUser(userID);
  const user = await userObjectMapper(response);
  user.isOwner = await votingContractInstance.isOwner(userID);
  return res.json({
   user,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

module.exports = router;
