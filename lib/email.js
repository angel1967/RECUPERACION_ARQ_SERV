const nodemailer = require("nodemailer");
const logger = require('../lib/logger')('email');

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=https://${process.env.HOSTNAME}:${process.env.PORT}/api/users/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).then(res => {
        logger.info(`[sendConfirmationEmail] The email was sent successfully.`)
    })
    .catch(error =>
        logger.error(`[sendConfirmationEmail] The email could not be sent. ${error}`)
    );
};