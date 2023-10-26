const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
 try {
  const token = req?.cookies?.token;
  if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  req.userID = verified.userID;
  console.log("authenticated");
  next();
 } catch (err) {
  console.log(err);
  res.status(401).json({ errorMessage: "Unauthorized" });
 }
};

const isOwner = async (req, res, next) => {
 try {
  const { userID } = req.body;
  if (!userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.isOwner(userID);
  if (!response) return res.status(401).json({ errorMessage: "Unauthorized" });
  req.isOwner = true;
  next();
 } catch (err) {
  console.log(err);
  res.status(401).json({ errorMessage: "Unauthorized" });
 }
};

module.exports = { authenticate, isOwner };
