// emailHelper.js
const nodemailer = require("nodemailer");
const config = require("../config/config");

exports.sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    // host: config.SMTP_HOST,
    // port: config.SMTP_PORT,
    service: "gmail",
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: config.FROM_EMAIL,
    to,
    subject,
    html,
  });
};

// otpHelper.js
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
