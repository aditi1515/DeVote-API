const nodemailer = require("nodemailer");

const config = {
 service: "gmail",
 host: "smtp.gmail.com",
 port: 587,
 secure: false,
 auth: {
  user: "devote.bot@gmail.com",
  pass: process.env.MAIL_PASSKEY,
 },
};

function generateUserSignUpData(userID,recipient_email,username) {
 const emailTemplate = `
   <html>
     <head>
       <style>
         body {
           font-family: Arial, sans-serif;
         }
         p {
           font-size: 16px;
           margin-bottom: 10px;
         }
         .header {
           background-color: #007BFF;
           color: #ffffff;
           text-align: center;
           padding: 20px;
         }
       </style>
     </head>
     <body>
       <div class="header">
         <h1>Welcome to Devote</h1>
       </div>
       <p>Dear ${username} ,</p>
       <p>Thank you for signing up with our service!</p>
       <p>Your unique user ID is: ${userID}</p>
       <p>Feel free to use this ID for login and access to our platform.</p>
       <p>Best regards,</p>
       <p>Devote</p>
     </body>
   </html>
 `;

 const data = {
  from: "devote.bot@gmail.com",
  to: recipient_email,
  subject: "Welcome to Devote",
  html: emailTemplate,
 };

 return data;
}

const sendMail = (data) => {
 const transporter = nodemailer.createTransport(config);
 transporter.sendMail(data, (error, info) => {
  if (error) {
   console.log(error);
  } else {
   console.log("Email sent: " + info.response);
  }
 });
};

module.exports = { generateUserSignUpData, sendMail };
