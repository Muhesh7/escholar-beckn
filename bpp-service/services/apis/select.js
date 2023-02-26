'use strict'

const protocolCallbacks = require('@services/protocolCallbacks/')
const bapQueries = require('@database/storage/bap/queries')
const Item = require('@models/Item')
const Form = require('@models/Form')
const Workflow = require('@models/Workflow')
exports.select = async (requestBody) => {
	try {
		const context = requestBody.context
		const message = requestBody.message
		// const sessionId = message.order.provider.id
		// const providerId = message.order.provider.id
		const itemId = message.order.items[0].id
		const { bap } = await bapQueries.findOrCreate({
			where: { bapId: context.bap_id, bapUri: context.bap_uri },
		})
		const host = requestBody.host.split(', ')[0]
		console.log('Select itemid:', itemId)
		const item = await Item.findById(itemId)
		if (!item) {
			throw new Error('Item not found')
		}
		
		const workflow = await Workflow.findOne({
			item: itemId
		})
		
		if (!workflow) {
			throw new Error('Workflow not found')
		}


		const form = await Form.findOne({
			workflow: workflow._id
		})

		console.log('SELECTED ITEM', item)
		console.log('SELECTED FORM', form)

		await protocolCallbacks.onSelect({
			transactionId: context.transaction_id,
			messageId: context.message_id,
			bapId: bap.bapId,
			bapUri: bap.bapUri,
			host, 
			item,
			form
		})
	} catch (err) {
		console.log(err)
	}
}
