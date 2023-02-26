'use strict'
const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
	provider: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	descriptor: {
		code: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
})

module.exports = mongoose.model('Category', CategorySchema)