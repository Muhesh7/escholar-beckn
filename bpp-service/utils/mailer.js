'use strict'
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(toMail, moderator, supervisor, subscriberId) {

	// Define the email options
	let msg = {
		to: toMail,
		from: 'ctpapers52@gmail.com',
		subject: 'Client Authentication Certificates',
		html: `
			<div style="font-family: Arial, sans-serif; color: #333;">
				<h2 style="color: #0077c0;">Client Authentication Certificates</h2>
				<p>Dear Subscriber,</p>
				<p>Here is your dashboard link <a href="https://${subscriberId}">${subscriberId}</a>. Please find attached your client authentication certificates for moderator and supervisor.</p>
				<h3 style="color: #0077c0;">Certificate Details</h3>
				<table style="border-collapse: collapse; width: 100%;">
					<thead>
						<tr style="background-color: #0077c0; color: #fff;">
							<th style="padding: 8px; border: 1px solid #ddd;">Certificate Type</th>
							<th style="padding: 8px; border: 1px solid #ddd;">Filename</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="padding: 8px; border: 1px solid #ddd;">Moderator Certificate</td>
							<td style="padding: 8px; border: 1px solid #ddd;">moderator_certificate.pfx</td>
						</tr>
						<tr>
							<td style="padding: 8px; border: 1px solid #ddd;">Supervisor Certificate</td>
							<td style="padding: 8px; border: 1px solid #ddd;">supervisor_certificate.pfx</td>
						</tr>
					</tbody>
				</table>
				<p>Thank you for choosing our service!</p>
				<p>Best regards,</p>
				<p>The Beckn Bros Team</p>
			</div>
		`,
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