// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from the .env file

// Create an Express application
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Uncomment the following lines if you encounter CORS issues
 //const cors = require('cors');
 //app.use(cors());

// Route to handle callback requests
app.post('/callback', async (req, res) => {
  try {
    // Extract data from the request body
    const { companyName, mobileNumber, details } = req.body;

    // Validate required fields
    if (!companyName || !mobileNumber) {
      return res.status(400).send('Error: Company Name and Mobile Number are required.');
    }

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: process.env.SMTP_USER, // SMTP username from .env file
        pass: process.env.SMTP_PASS, // SMTP password from .env file
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER, // Sender email address
      to: process.env.RECIPIENT_EMAIL || 'ayankh6543@gmail.com', // Receiver email address
      subject: 'New Callback Request',
      text: `Company Name: ${companyName}\nMobile Number: ${mobileNumber}\nDetails: ${details || 'No additional details provided'}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).send('Your request has been sent successfully!');
  } catch (error) {
    // Log the error and send an error response
    console.error('Error:', error);
    res.status(500).send('Error: Failed to send email.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use PORT from .env file or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
