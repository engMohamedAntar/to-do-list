const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another like 'hotmail', 'outlook', etc.
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password or real password
    },
  });
  

  // 2) Define the email options
  const mailOptions = {
    from: 'To-Do-List <antarexplorer1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);  
};

module.exports = sendEmail;