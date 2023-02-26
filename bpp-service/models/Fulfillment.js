'use strict'
const mongoose = require('mongoose')

const FulfillmentSchema = new mongoose.Schema({
	provider: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		default: 'SCHOLARSHIP',
	},
	tracking: {
		type: Boolean,
		required: true,
		default: false,
	},
	contact: {
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		}
	}
})

module.exports = mongoose.model('Fulfillment', FulfillmentSchema)