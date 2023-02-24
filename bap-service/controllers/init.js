'use strict'
const requester = require('../utils/requester')
const { requestBodyGenerator } = require('../utils/requestBodyGenerator')
const { cacheSave, cacheGet } = require('../utils/redis')
const { v4: uuidv4 } = require('uuid')

exports.init = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const itemId = req.body.itemId
		const fulfillmentId = req.body.fulfillmentId
		await requester.postRequest(
			bppUri + '/init',
			{},
			requestBodyGenerator('bpp_init', { itemId, fulfillmentId }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:${messageId}`)
		if (message !== transactionId + messageId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:${messageId}:ON_INIT`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		else return res.status(200).send({ data: data })
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onInit = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		await cacheSave(`${transactionId}:${messageId}:ON_INIT`, req.body)
		await sendMessage(`${transactionId}:${messageId}`, transactionId + messageId)
		res.status(200).json({ status: true, message: 'BAP Received INIT From BPP' })
	} catch (err) {
		console.log(err)
	}
}
