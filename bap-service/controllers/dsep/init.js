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

exports.onInit = async (req, res) => {
    console.log(JSON.stringify(req.body))
	try {
		// const transactionId = req.body.context.transaction_id
		// const messageId = req.body.context.message_id
		// await cacheSave(`${transactionId}:${messageId}:ON_INIT`, req.body)
		// await sendMessage(`${transactionId}:${messageId}`, transactionId + messageId)
		// res.status(200).json({ status: true, message: 'BAP Received INIT From BPP' })
	} catch (err) {
		console.log(err)
	}
}
