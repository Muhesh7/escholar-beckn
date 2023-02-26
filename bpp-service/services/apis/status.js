'use strict'

const protocolCallbacks = require('@services/protocolCallbacks/')
// const sessionAttendanceQueries = require('@database/storage/sessionAttendance/queries')
const bapQueries = require('@database/storage/bap/queries')
const FormResponse = require('@models/FormResponse')
const Item = require('@models/Item')
const Workflow = require('@models/Workflow')
const Form = require('@models/Form')

exports.status = async (requestBody) => {
	try {
		const context = requestBody.context
		const message = requestBody.message
		const orderId = message.order_id
		// const sessionAttendanceDoc = await sessionAttendanceQueries.findByOrderId(orderId)
		// if (!sessionAttendanceDoc) return console.log('SessionAttendance Not Found')
		// console.log(sessionAttendanceDoc)
		const { bap } = await bapQueries.findOrCreate({
			where: { bapId: context.bap_id, bapUri: context.bap_uri },
		})
		// const status = sessionAttendanceDoc.statusText

		const formResponse = await FormResponse.findById(orderId)
		if (!formResponse) {
			throw new Error('FormResponse not found')
		}
		const status = formResponse.status || 'UNDEFINED'
		const itemId = formResponse.item
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
		if (!form) {
			throw new Error('Form not found')
		}
		
		console.log('Status: ', status)
		await protocolCallbacks.onStatus({
			transactionId: context.transaction_id,
			messageId: context.message_id,
			bapId: bap.bapId,
			bapUri: bap.bapUri,
			status,
			// sessionId: sessionAttendanceDoc.sessionId.toString(),
			// fulfillmentId: sessionAttendanceDoc.fulfillmentId.toString(),
			formResponse,
			form,
			workflow,
			item,
			host: requestBody.host
		})
	} catch (err) {
		console.log(err)
	}
}
