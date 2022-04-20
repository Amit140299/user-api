const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: ,
    auth: {
      user: '',
      pass: '',
    },
  });

  const message = {
    from: `${'admin'} <${'noreply@userapp.io'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(message);

  // Log message
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
