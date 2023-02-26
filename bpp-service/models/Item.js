'use strict'
const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
	provider: {
		type: String,
		required: true,
	},
	descriptor: {
		name: {
			type: String,
			required: true,
		},
		long_desc: {
			type: String,
			required: true,
		},
	},
	price: {
		currency: {
			type: String,
			required: true,
			default: 'INR',
		},
		value: {
			type: Number,
			required: true,
		},
	},
	rateable: {
		type: Boolean,
		required: true,
		default: false,
	},

	// tags: [
	// 	{
	// 		display: {
	// 			type: Boolean,
	// 			required: true,
	// 			default: true,
	// 		},
	// 		descriptor: {
	// 			code: {
	// 				type: String,
	// 				required: true,
	// 			},
	// 			name: {
	// 				type: String,
	// 				required: true,
	// 			},
	// 		},
	// 		list: [
	// 			{
	// 				descriptor: {
	// 					code: {
	// 						type: String,
	// 						required: true,
	// 					},
	// 					name: {
	// 						type: String,
	// 						required: true,
	// 					},
	// 				},
	// 				value: {
	// 					type: String,
	// 					required: true,
	// 				},
	// 				display: {  
	// 					type: Boolean,
	// 					required: true,
	// 					default: true,
	// 				}
	// 			}
	// 		]
	// 	}
	// ],

	category_ids: {
		type: [String],
		required: true,
		default: [],
	},
	fulfillment_ids: {
		type: [String],
		required: true,
		default: [],
	}
})

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item