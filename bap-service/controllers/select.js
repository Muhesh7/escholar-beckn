'use strict'
const requester = require('../utils/requester')
const { requestBodyGenerator } = require('../utils/requestBodyGenerator')
const { cacheSave, cacheGet } = require('../utils/redis')
const { v4: uuidv4 } = require('uuid')

exports.select = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const providerId = req.body.providerId
		const itemId = req.body.itemIds
        const fulfillmentIds = req.body.fulfillmentIds
		await requester.postRequest(
			bppUri + '/select',
			{},
			requestBodyGenerator('bpp_select', { providerId, fulfillmentIds, itemIds }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:${messageId}`)
		if (message !== transactionId + messageId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:${messageId}:ON_SELECT`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		res.status(200).send({ data: data })
		await cacheSave(`${bppUri}:${itemId}:ENROLLED`, false)
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onSelect = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		await cacheSave(`${transactionId}:${messageId}:ON_SELECT`, req.body)
		await sendMessage(`${transactionId}:${messageId}`, transactionId + messageId)
		res.status(200).json({ status: true, message: 'BAP SELECTION From BPP' })
	} catch (err) {}
}