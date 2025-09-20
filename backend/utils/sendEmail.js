// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter using Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'), // Ensure port is a number
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports (like 587 with TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // If using Gmail with app passwords, you might need tls configuration:
    // tls: {
    //   rejectUnauthorized: false // Use this if you encounter certificate issues (not recommended for production)
    // }
  });

  // Mail options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // HTML content for the email body
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;