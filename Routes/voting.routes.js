const express = require("express");
const { votingContractInstance } = require("../configuration.js");
const { contestObjectMapper } = require("../utils/mappers.js");
const { authenticate } = require("../middleware/authenticate.js");
const router = express.Router();

router.post("/createContest",authenticate, async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { title } = req.body;
  if (!title || !userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.createContest(
   title,
   [],
   userID
  );
  return res.json({
   message: "Contest created successfully",
   response,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/isOwner", authenticate , async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  if (!userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.isOwner(userID);
  return res.json({
   response,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/startContest", authenticate , async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { contestIdx } = req.body;
  if (contestIdx === undefined || !userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.startContest(
   contestIdx,
   userID
  );
  return res.json({
   message: "Contest started successfully",
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/endContest",authenticate, async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { contestIdx } = req.body;
  if (contestIdx === undefined || !userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.endContest(contestIdx, userID);
  return res.json({
   message: "Contest ended successfully",
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/requestToParticipate",authenticate, async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { contestIdx } = req.body;
  console.log(contestIdx, userID);
  if (contestIdx === undefined || !userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.addRequestParticipant(
   contestIdx,
   userID
  );
  return res.json({
   message: "Request to participate in contest has been sent successfully",
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/addParticipant", authenticate , async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { contestIdx, participantUserID } = req.body;
  if (contestIdx === undefined || !userID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.addParticipant(
   contestIdx,
   participantUserID,
   userID
  );
  return res.json({
   message: "Participant added successfully",
   response,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/vote",authenticate, async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const userID = req.userID;
  const { contestIdx, participantUserID } = req.body;
  if (contestIdx === undefined || !userID || !participantUserID)
   return res.status(400).json({ message: "All fields are required" });
  const response = await votingContractInstance.vote(
   contestIdx,
   participantUserID,
   userID
  );
  return res.json({
   message: "Vote added successfully",
   response,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

router.post("/getAllContests", authenticate ,  async (req, res) => {
 if (!votingContractInstance)
  return res
   .status(500)
   .json({ message: "Voting contract instance not found" });
 try {
  const response = await votingContractInstance.getAllContests();
  const contests = contestObjectMapper(response);
  return res.json({
   message: "All contests fetched successfully",
   contests,
  });
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
 }
});

module.exports = router;
