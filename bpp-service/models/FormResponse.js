'use strict'

const mongoose = require('mongoose')

const FormResponseSchema = new mongoose.Schema({
	host: {
		type: String,
		required: true,
	},
	form: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Form',
	},
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Item',
	},
	data: {
		type: String,
		required: true,
	},
	cid: {
		type: String,
		default: '',
	},
	name : {
		type: String,
		default: '',
	},
	stage: {
		type: Number,
	},
	isDone: {
		type: Boolean,
	},
	nextDesignation: {
		type: String,
	}
})

const FormResponse = mongoose.model('FormResponse', FormResponseSchema)

module.exports = FormResponse