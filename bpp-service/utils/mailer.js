'use strict'
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(toMail, moderator, supervisor) {

	// Define the email options
	let msg = {
		to: toMail,
		from: 'ctpapers52@gmail.com',
		subject: 'Client Authentication Certificates',
		text: 'Please find attached your client auth certificates for moderator and superviser.',
		attachments: [
			{
				filename: 'moderator_certificate.pfx',
				content: moderator.toString('base64'),
				disposition: 'attachment',
			},
			{
				filename: 'supervisor_certificate.pfx',
				content: supervisor.toString('base64'),
				disposition: 'attachment',
			}
		],
	}

	// Send the email
	await sgMail.send(msg)
}

module.exports = sendEmail