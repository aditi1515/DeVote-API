const express = require("express");
const {
 userContractInstance,
 votingContractInstance,
} = require("../configuration.js");
const jwt = require("jsonwebtoken");
const { userObjectMapper } = require("../utils/mappers.js");
const { authenticate, isOwner } = require("../middleware/authenticate.js");
const { generateUserID } = require("../utils/userIDgenerator.js");
const { generateUserSignUpData, sendMail } = require("../utils/mailer.js");
const { isValidAadhaar } = require("../utils/aadhaarValidator.js");
const User = require("../DB/userAadhaar.schema.js");
const aadhaarKYC = require("../utils/aadhaarKYC.js");

const router = express.Router();

///////////////////////////////////////////login route///////////////////////////////
router.post("/login", async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  const { userID, password } = req.body;
  console.log(userID, password);
  if (!userID || !password)
   return res.status(400).json({ message: "Username and password required" });

  const response = await userContractInstance.login(userID, password);
  const user = await userObjectMapper(response);
  user.isOwner = await votingContractInstance.isOwner(userID);
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
   expiresIn: "1h",
  });

  return res
   .cookie("token", token, {
    expires: new Date(Date.now() + 90000000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
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

////////////////////////////////// SIGN UP //////////////////////////////////

router.post("/signup", async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  const {
   firstname,
   lastname,
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

  if (isValidAadhaar(aadhaarNumber) === false)
   return res.status(400).json({ message: "Invalid Aadhaar Number" });

  // get aadhaar details from DB

  const dbPayload = await User.findOne({
   aadhaarNumber: aadhaarNumber,
  });

  if (!dbPayload)
   return res
    .status(400)
    .json({ message: "Aadhaar KYC failed because it is not found in DB" });

  console.log("dbPayload", dbPayload);

  if (
   aadhaarKYC({ firstname, lastname, age, aadhaarNumber }, dbPayload) === false
  ) {
   return res
    .status(400)
    .json({ message: "Aadhaar KYC failed!! Please enter valid details" });
  }

  const userID = generateUserID(req.body);

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

  console.log(response);

  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
   expiresIn: "1h",
  });
  console.log("generated userid", userID);
  let emailData = generateUserSignUpData(
   userID,
   email,
   firstname + " " + lastname
  );

  sendMail(emailData);

  res
   .cookie("token", token, {
    sameSite: "strict",
    expires: new Date(Date.now() + 90000000),
    httpOnly: true,
   })
   .json({ message: "user created successfully", userID });
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

router.post("/getUsers", authenticate, async (req, res) => {
 if (!userContractInstance)
  return res.status(500).json({ message: "User contract instance not found" });
 try {
  let users = [];
  const { userIDs } = req?.body;
  if (!userIDs) return res.status(400).json({ message: "User IDs required" });
  for (let userID of userIDs) {
   const response = await userContractInstance?.getUser(userID);
   const user = await userObjectMapper(response);
   user.isOwner = await votingContractInstance.isOwner(userID);
   users.push(user);
  }

  return res.json({
   users,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

module.exports = router;
