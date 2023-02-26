'use strict'
var express = require('express')
var router = express.Router()
var Workflow = require('../models/Workflow')
var Item = require('../models/Item')

router.post('/', async (req, res) => {
	const {name, state, amount, description} = req.body
	console.log(req.body)
	let host = req.hostname.split('.')[0]
	host = host + '.' + process.env.BECKN_HOST_NAME
	try {
		const scholarship = await Item.create({
			provider: host,
			descriptor: {
				name,
				long_desc: description,
			},
			price: {
				value: amount,
			},
		})
		const workflow = new Workflow({
			name,
			state,
			item: scholarship._id,
		})
		await workflow.save()
		res.status(201).json(workflow)
	} catch (err) {
		console.log(err)
		res.status(500).send({message: 'Error creating workflow'})
	}
})

router.get('/all', async (req, res) => {
	try {

		let host = req.hostname.split('.')[0]
		host = host + '.' + process.env.BECKN_HOST_NAME
		console.log(host)
		const workflows = await (await Workflow.find({}).populate('item')).filter((workflow) => {
			return workflow.item.provider === host
		})
		res.json(workflows)
	} catch (err) {
		console.log(err)
		res.status(500).send({message: 'Failed to fetch workflow list'})
	}
})

router.get('/:id', async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id)
		if (workflow) {
			res.json(workflow)
		} else {
			res.status(404).send({message: `Could not find form ${req.params.id}`})
		}
	} catch (err) {
		res.status(500).send({message: 'Failed to fetch workflow'})
	}
})

router.put('/:id', async (req, res) => {
	try {
		const { name, state } = req.body
		const workflow = await Workflow.findById(req.params.id)
		if (workflow) {
			workflow.name = name
			workflow.state = state
			await workflow.save()
			res.status(200).json(workflow)
		} else {
			res.status(404).send({message: `Could not find form ${req.params.id}`})
		}
	} catch (err) {
		res.status(500).send({message: `Error updating workflow ${req.params.id}`})
	}
})

router.delete('/:id', async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id)
		if (workflow) {
			await workflow.remove()
			res.status(200).json({message: 'Workflow Deleted'})
		} else {
			res.status(404).send({message: `Could not find workflow ${req.params.id}`})
		}
	} catch (err) {
		res.status(500).send({message: `Error deleting workflow ${req.params.id}`})
	}
})

module.exports = router