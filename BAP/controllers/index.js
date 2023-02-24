'use strict'
const requester = require('../utils/requester')
const { requestBodyGenerator } = require('../utils/requestBodyGenerator')
const { cacheSave, cacheGet } = require('../utils/redis')
const { v4: uuidv4 } = require('uuid')

exports.search = async (req, res) => {
	try {
		const transactionId = uuidv4()
		const messageId = uuidv4()
		await requester.postRequest(
			process.env.BECKN_BG_URI + '/search',
			{},
			requestBodyGenerator('bg_search', { keyword: req.query.keyword }, transactionId, messageId),
			{ shouldSign: true }
		)
		setTimeout(async () => {
			const data = await cacheGet(`${transactionId}:${messageId}:ON_SEARCH`)
			if (!data) res.status(403).send({ message: 'No data Found' })
			else res.status(200).send({ data: data })
		}, 3000)
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onSearch = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		const data = await cacheGet(`${transactionId}:${messageId}:ON_SEARCH`)
		if (data) {
			data.push(req.body)
			await cacheSave(`${transactionId}:${messageId}:ON_SEARCH`, data)
			await cacheSave('LATEST_ON_SEARCH_RESULT', data)
		} else {
			await cacheSave(`${transactionId}:${messageId}:ON_SEARCH`, [req.body])
			await cacheSave('LATEST_ON_SEARCH_RESULT', [req.body])
		}
		res.status(200).json({ status: true, message: 'BAP Received Data From BPP' })
	} catch (err) {}
}