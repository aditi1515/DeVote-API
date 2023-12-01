function aadhaarKYC(userPayload, dbPayload) {
 console.log("userPayload", userPayload);
 console.log("dbPayload", dbPayload);

 if (!userPayload || !dbPayload) {
  return false;
 }

 if (validatePayloads(userPayload, dbPayload) === false) {
  return false;
 }

 if (userPayload.aadhaarNumber !== dbPayload.aadhaarNumber) {
  return false;
 }
 if (userPayload.firstname !== dbPayload.firstname) {
  return false;
 }
 if (userPayload.lastname !== dbPayload.lastname) {
  return false;
 }
 if (userPayload.age !== dbPayload.age) {
  return false;
 }

 return true;
}

function validatePayloads(userPayload, dbPayload) {
 const requiredProperties = ["aadhaarNumber", "firstname", "lastname", "age"];

 const missingProperties = requiredProperties.filter(
  (property) => !userPayload[property] || !dbPayload[property]
 );

 if (missingProperties.length > 0) {
  console.log(
   "Validation failed: Missing required properties -",
   missingProperties.join(", ")
  );
  return false;
 }
 console.log("Aadhaar KYC Validation passed");
 return true;
}

module.exports = aadhaarKYC;
