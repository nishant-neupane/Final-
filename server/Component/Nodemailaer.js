// nodemailerComponent.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async ({ to, subject, text }) => {
  try {
    // console.log(process.env.MAIL_HOST)
    // console.log(process.env.MAIL_PORT)
    // console.log(process.env.MAIL_USERNAME)
    // console.log(process.env.MAIL_PASSWORD)

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text,
    });

  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendMail };
