// emailHelper.js
const nodemailer = require("nodemailer");
const config = require("../config/config");

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: config.FROM_EMAIL,
    to,
    subject,
    text,
  });
};

// otpHelper.js
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
