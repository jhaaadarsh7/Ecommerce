// // // const nodeMailer = require("nodemailer");


// // // const sendEmail = async (option)=>{
// // //   const transpoter = nodeMailer.createTransport({
// // //     service:process.env.SMPT_SERVICE,
// // //     auth:{
// // //         user: process.env.SMPT_MAIL,
// // //         pass: process.env.SMPT_PASSWORD,
// // //     },
// // //   });
// // //   const mailOptions = {
// // //     from: process.env.SMPT_MAIL,
// // //     tO: option.email,
// // //     subject: options.message,
// // //   };
// // //   await transpoter.sendMail(mailOptions);
// // // }
// // // module.exports = sendEmail;


// // const nodeMailer = require("nodemailer");

// // const sendEmail = async (options) => {
// //   // const transporter = nodeMailer.createTransport({
// //   //   host: process.env.SMTP_HOST,
// //   //   port: process.env.SMTP_PORT,
// //   //   service: process.env.SMTP_SERVICE,
// //   //   auth: {
// //   //     user: process.env.SMTP_MAIL,
// //   //     pass: process.env.SMTP_PASSWORD,
// //   //   },
// //   // });

// //   var transporter = nodemailer.createTransport({
// //     host: "sandbox.smtp.mailtrap.io",
// //     port: 2525,
// //     auth: {
// //       user: "8d3c9b0e5a5ddc",
// //       pass: "09c3dc439b028e"
// //     }
// //   });

// //   const mailOptions = {
// //     from: process.env.SMTP_MAIL,
// //     to: options.email,
// //     subject: options.subject,
// //     text: options.message,
// //   };

// //   await transporter.sendMail(mailOptions);
// // };

// // module.exports = sendEmail;

// var nodemailer = require('nodemailer');

// var transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "8d3c9b0e5a5ddc",
//     pass: "09c3dc439b028e"
//   }
// });

// var mailOptions = {
//   from: 'risav55@gmail.com',
//   to: 'jhaaadarsh582@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transport.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;