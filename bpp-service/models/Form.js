'use strict'
const mongoose = require('mongoose')

const FormSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	data: {
		type: String,
		required: true,
	},
	workflow: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workflow',
		required: true,
	},
	host: {
		type: String,
		required: true,
	}
})

const Form = mongoose.model('Form', FormSchema)

module.exports = Form