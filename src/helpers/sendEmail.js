const nodemailer = require('nodemailer');

const google = {
  email: 'motaz.dn.ali.hasan@gmail.com',
  app_password: 'eeoyfuhqcegumody',
  receiverEmail: 'motaz.dn.ali@gmail.com',
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: google.email,
    pass: google.app_password,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: google.email,
      to,
      subject,
      text: message,
    });
    return info;
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};

module.exports = sendEmail;
