//////////////////UniqueBlendID /////////////////////

const crypto = require("crypto");

function generateUserID(user) {
 // Create an array to hold the selected user data
 const selectedData = [];
 const userProps = Object.keys(user);

 // Randomly select user properties to include
 userProps.forEach((prop) => {
  if (Math.random() > 0.5) {
   selectedData.push(user[prop]);
  }
 });

 if (selectedData.length === 0) {
  selectedData.push(user["aadhaarNumber"]);
 }
 // Shuffle the selected data

 const shuffledData = shuffleArray(selectedData);

 // Concatenate the selected and shuffled data
 const concatenatedData = shuffledData.join("");

 // Apply XOR operation to the concatenated data
 const xorResult = applyXOR(concatenatedData, user["aadhaarNumber"]);

 return stringToNumericCode(xorResult);
}

function shuffleArray(array) {
 for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
 }
 return array;
}

function applyXOR(data, aadhaarNumber) {
 const key = aadhaarNumber; // Replace with your secret key
 const result = [];
 for (let i = 0; i < data.length; i++) {
  result.push(
   String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  );
 }
 return result.join("");
}
function stringToNumericCode(input) {
 const hash = crypto.createHash("sha256");
 hash.update(input);
 const hexHash = hash.digest("hex");

 // Convert the hexadecimal hash to a numeric code (base 10)
 const numericCode = BigInt("0x" + hexHash).toString();

 // Ensure the numeric code is of the desired length
 const trimmedNumberString = numericCode.toString().slice(0, 12);

 // Convert the trimmed string back to a number
 const trimmedNumber = Number(trimmedNumberString);

 return trimmedNumber;
}

module.exports = { generateUserID };
