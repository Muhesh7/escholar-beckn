const sgMail = require("@sendgrid/mail");
const fs = require("fs");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(toMail, moderator, superuser) {

    // Define the email options
    let msg = {
        to: toMail,
        from: "ctpapers52@gmail.com",
        subject: "Client Authentication Certificates",
        text: "Please find attached your client auth certificates for moderator and superuser.",
        attachments: [
            {
                filename: "moderator_certificate.cert",
                content: moderator.toString("base64"),
                disposition: "attachment",
            },
            {
                filename: "superuser_certificate.cert",
                content: superuser.toString("base64"),
                disposition: "attachment",
            }
        ],
    };

    // Send the email
    await sgMail.send(msg);
}

module.exports = sendEmail;