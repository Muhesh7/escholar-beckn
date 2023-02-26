'use strict'
const mongoose = require('mongoose')

const WorkflowSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	state: {
		type: [
			{
				'status': String,
				'designation': String,
			}
		],
		default: [],
		required: true,
	},
	item: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Item',
		required: true,
	},
})

const Workflow = mongoose.model('Workflow', WorkflowSchema)

module.exports = Workflow