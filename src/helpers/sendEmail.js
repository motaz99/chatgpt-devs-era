const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, message) => {
  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    text: message,
  });
  return info;
};

module.exports = sendEmail;
