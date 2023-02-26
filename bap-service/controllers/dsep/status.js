'use strict'
const requester = require('../../utils/requester')
const { requestBodyGenerator } = require('../../utils/requestBodyGenerator')
const { v4: uuidv4 } = require('uuid')

// const { readCertificate } = require('../blockchain');

exports.status = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const orderId = req.body.orderId
		await requester.postRequest(
			bppUri + '/status',
			{},
			requestBodyGenerator('bpp_status', { orderId }, transactionId, messageId),
			{ shouldSign: true }
		)
		res.send("done");
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

