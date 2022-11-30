require("dotenv").config();
const sgMail = require("@sendgrid/mail");
//const nodemailer = require("nodemailer");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const sendMail = (host, port, User, pass) => {
//   const transporter = nodemailer.createTransport({
//     host: host,
//     port: port,
//     auth: {
//       user: User,
//       pass: pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   return transporter;
// };
const sendMail = async (receiver, source, subject, content) => {
  const msg = {
    to: receiver,
    from: source,
    subject,
    html: content,
  };

  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = sendMail;
