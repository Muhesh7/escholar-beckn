'use strict'
const requester = require('../../utils/requester')
const { requestBodyGenerator } = require('../../utils/requestBodyGenerator')
const { v4: uuidv4 } = require('uuid')

exports.init = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const items = req.body.items
        const providerId = req.body.providerId
		const fulfillments = req.body.fulfillments
		await requester.postRequest(
			bppUri + '/init',
			{},
			requestBodyGenerator('bpp_init', { providerId, items, fulfillments }, transactionId, messageId),
			{ shouldSign: true }
		)
        res.send("done");
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

