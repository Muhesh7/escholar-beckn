'use strict'
const { v4: uuidv4 } = require('uuid')
const { faker } = require('@faker-js/faker')

const requestBody = {
	context: {
		domain: process.env.DOMAIN,
		country: process.env.COUNTRY,
		city: process.env.CITY,
		action: 'temp',
		bap_id: process.env.BAP_ID,
		bap_uri: process.env.BAP_URI,
		timestamp: new Date().toISOString(),
		message_id: uuidv4(),
		core_version: '1.0.0',
		ttl: 'PT1S',
	},
	message: {},
}

exports.requestBodyGenerator = (api, body, transactionId, messageId) => {
	requestBody.context.transaction_id = transactionId
	requestBody.context.message_id = messageId
	if (api === 'bg_search') {
		requestBody.context.action = 'search'
		requestBody.message = {
			intent: body.intent,
		}
	}  else if (api === 'bpp_init') {
		requestBody.context.action = 'init'
		requestBody.message = {
			order: {
                provider: {
                    id: body.providerId
                },
				items: [{ id: body.itemId }],
				fulfillments: [{ id: body.fulfillmentId }],
			},
		}
	} else if (api === 'bpp_select') {
		requestBody.context.action = 'select'
		requestBody.message = {
			order: {
              provider: {
                    id: body.providerId
                },
                fulfillments: body.fulfillmentIds,
                items: body.items
			},
		}
	}  else if (api === 'bpp_confirm') {
		requestBody.context.action = 'confirm'
		requestBody.message = {
			order: {
              provider: body.provider,
              fulfillments: body.fulfillments,
              items: body.items
			},
		}
	} else if (api === 'bpp_status') {
		requestBody.context.action = 'status'
		requestBody.message = {
			order: {
				id: body.orderId,
			},
		}
	}
	return requestBody
}
