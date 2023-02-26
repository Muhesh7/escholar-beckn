'use strict'
const requester = require('../../utils/requester')
const { requestBodyGenerator } = require('../../utils/requestBodyGenerator')
const { v4: uuidv4 } = require('uuid')

exports.select = async (req, res) => {
    console.log(JSON.stringify(req.body))
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bpp_uri
		const providerId = req.body.provider_id
		const itemId = req.body.item_id
        const fulfillmentIds = req.body.fulfillment_ids || []
        console.log(req.body)
		await requester.postRequest(
			bppUri + '/select',
			{},
			requestBodyGenerator('bpp_select', { providerId, fulfillmentIds, itemId }, transactionId, messageId),
			{ shouldSign: true }
		)
		res.send("done");
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}
