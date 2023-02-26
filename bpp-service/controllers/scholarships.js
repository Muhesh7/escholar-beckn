'use strict'
const Item = require('../models/Item')
const Category = require('../models/Category')
const Fulfillment = require('../models/Fulfillment')
exports.addScholarship = async (req, res) => {
	const { name, description, amount, categoryIds, fulfillmentIds } = req.body
	const host = req.hostname
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
			category_ids: categoryIds,
			fulfillment_ids: fulfillmentIds
		})

		res.status(200).json({ scholarship })
	}
	catch(err) {
		console.log(err)
		res.status(500).json({ message: 'Internal Server Error: creating scholarship' })
	}
}

exports.getScholarships = async (req, res) => {
	// const host = req.headers['x-forwarded-host'].split(', ')[0]
	const host = req.hostname
	const scholarships = await Item.find({
		provider: host
	})
	res.status(200).json({ scholarships })
}

exports.deleteScholarship = async (req, res) => {
	const { id } = req.body
	const host = req.headers['x-forwarded-host']
	try {
		// check if scholarship exists
		const scholarship = await Item.findById(id)
		if (!scholarship) {
			return res.status(404).json({ message: 'Scholarship not found' })
		}
		// check if scholarship belongs to host
		if (scholarship.provider !== host) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		// delete scholarship
		await scholarship.remove()
		res.status(200).json({ message: 'Scholarship deleted' })
	}
	catch(err) {
		console.log(err)
		res.status(500).json({ message: 'Internal Server Error: deleting scholarship' })
	}
}

exports.addCategory = async (req, res) => {
	const {id, code, name} = req.body
	const host = req.headers['x-forwarded-host']
	try {
		const category = await Category.create({
			provider: host,
			id,
			descriptor: {
				code,
				name
			}
		})
		res.status(200).json({ category })
	}
	catch(err) {
		console.log(err)
		res.status(500).json({ message: 'Internal Server Error: creating category' })
	}
}

exports.getCategories = async (req, res) => {
	const host = req.headers['x-forwarded-host']
	const categories = await Category.find({
		provider: host
	})
	res.status(200).json({ categories })
}

exports.addFulfillment = async (req, res) => {
	const { id, phone, email} = req.body
	const host = req.headers['x-forwarded-host']
	try {
		const fulfillment = await Fulfillment.create({
			provider: host,
			id,
			contact: {
				phone,
				email
			}
		})
		res.status(200).json({ fulfillment })
	}
	catch(err) {
		console.log(err)
		res.status(500).json({ message: 'Internal Server Error: creating fulfillment' })
	}
}

exports.getFulfillments = async (req, res) => {
	const host = req.headers['x-forwarded-host']
	const fulfillments = await Fulfillment.find({
		provider: host
	})
	res.status(200).json({ fulfillments })
}
