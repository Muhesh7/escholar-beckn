'use strict'
const bapQueries = require('@database/storage/bap/queries')
// const sessionAttendanceQueries = require('@database/storage/sessionAttendance/queries')
// const userQueries = require('@database/storage/user/queries')
// const { internalRequests } = require('@helpers/requests')
const protocolCallbacks = require('@services/protocolCallbacks/')
// const sessionAttendanceModel = require('@database/storage/sessionAttendance/model')
const FormResponse = require('@models/FormResponse')
const Workflow = require('@models/Workflow')
const Form = require('@models/Form')
const Item = require('@models/Item')
const { createScholarship } = require('../../utils/blockchain')

exports.confirm = async (requestBody) => {
	try {
		const context = requestBody.context
		const message = requestBody.message
		const { bap } = await bapQueries.findOrCreate({
			where: { bapId: context.bap_id, bapUri: context.bap_uri },
		})
		const host = requestBody.host

		const email = message.email
		const fileName = message.fileName

		const itemId = message.order.items[0].id

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

		const requester = { email, role: 'Student' }

		let states = workflow.state

		states = states.map(state => {
			return {
				status: state.status,
				designation: state.designation,
				domain: host
			}
		})

		const submissionId = message.order.items[0].xinput.form.submission_id
		console.log(requester, states, submissionId, fileName)
		const certificateId = (await createScholarship(requester, states, submissionId, fileName)).toString()

		const formData = message.order.items[0].xinput.form.data
		const formResponse = await FormResponse.create({
			item: itemId,
			form: form._id,
			data: formData,
			host: host,
			cid: submissionId,
		})

		// console.log(bap)
		// const billing = message.order.billing
		// const { user } = await userQueries.findOrCreate({
		// 	where: { email: billing.email, bapId: bap._id },
		// 	defaults: { name: billing.name },
		// })
		// console.log(user)
		// const { sessionAttendance, isNew } = await sessionAttendanceQueries.findOrCreate({
		// 	where: {
		// 		userId: user._id,
		// 		sessionId: message.order.items[0].id,
		// 		fulfillmentId: message.order.fulfillments[0].id,
		// 		status: sessionAttendanceModel.STATUS.ACTIVE,
		// 	},
		// })
		// console.log(sessionAttendance)
		// if (!isNew) throw 'Confirm.APIs.Services: User Already Enrolled'
		// const response = await internalRequests.mentoringPOST({
		// 	route: process.env.MENTORING_SESSION_ENROLL_ROUTE,
		// 	headers: {
		// 		internal_access_token: process.env.MENTORING_INTERNAL_ACCESS_TOKEN,
		// 	},
		// 	body: {
		// 		userId: user._id,
		// 		sendNotification: false,
		// 		name: user.name,
		// 		sessionId: sessionAttendance.sessionId,
		// 	},
		// })

		await protocolCallbacks.onConfirm({
			transactionId: context.transaction_id,
			messageId: context.message_id,
			bapId: bap.bapId,
			bapUri: bap.bapUri,
			host,
			formResponse,
			item,
			form,
			certificateId,
			// orderId: sessionAttendance.orderId,
			// fulfillmentId: sessionAttendance.fulfillmentId,
			// joinLink: response?.result?.link,/
		})
	} catch (err) {
		console.log(err)
	}
}
