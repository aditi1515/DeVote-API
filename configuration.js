const ethers = require("ethers");
require("dotenv").config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const userContractAddress = process.env.USER_CONTRACT_ADDRESS;
const votingContractAddress = process.env.VOTING_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi: userAbi } = require("./artifacts/contracts/User.sol/Users.json");
const {
 abi: votingAbi,
} = require("./artifacts/contracts/Voting.sol/Voting.json");
const userContractInstance = new ethers.Contract(
 userContractAddress,
 userAbi,
 signer
);
const votingContractInstance = new ethers.Contract(
 votingContractAddress,
 votingAbi,
 signer
);
module.exports = { userContractInstance, votingContractInstance };
