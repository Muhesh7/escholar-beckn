'use strict'
const responses = require('@constants/responses.json')
const confirmService = require('@services/apis/confirm')
const selectService = require('@services/apis/select')
const statusService = require('@services/apis/status')
const searchService = require('@services/apis/search')
const initService = require('@services/apis/init')


var User = require('../models/User')
const { createKeyPair } = require('../helpers/keyPair')
const { createBPP } = require('../helpers/registryRequests')
const { generateCertificate } = require('../utils/generateClientCert')
const mailProducer = require('../utils/producer')

exports.search = async (req, res) => {
	try {
		await res.status(200).send(responses.success_ack)
		req.body.host = req.headers['x-forwarded-host']
		console.log('Search request hostname', req.body.host)
		console.log(req.headers)
		searchService.search(req.body)
	} catch (err) {
		console.log(err)
	}
}

exports.select = async (req, res) => {
	try {
		await res.status(200).send(responses.success_ack)
		req.body.host = req.headers['x-forwarded-host']

		selectService.select(req.body)
	} catch (err) {
		console.log(err)
	}
}

exports.init = async (req, res) => {
	try {
		res.status(200).send(responses.success_ack)
		req.body.host = req.headers['x-forwarded-host']
		initService.init(req.body)
	} catch (err) {
		console.log(err)
	}
}

exports.confirm = async (req, res) => {
	try {
		res.status(200).send(responses.success_ack)
		req.body.host = req.headers['x-forwarded-host']
		console.log('Confirm request hostname', req.body.host)
		confirmService.confirm(req.body)
	} catch (err) {
		console.log(err)
	}
}

// exports.cancel = async (req, res) => {
// 	try {
// 		res.status(200).send(responses.success_ack)
// 		cancelService.cancel(req.body)
// 	} catch (err) {
// 		console.log(err)
// 	}
// }

exports.status = async (req, res) => {
	try {
		res.status(200).send(responses.success_ack)
		req.body.host = req.hostname
		await statusService.status(req.body)
	} catch (err) {
		console.log(err)
	}
}

exports.create = async (req, res) => {
	const {
		email,
		department,
		organisation,
		city
	} = req.body

	const subscriberId = department.toLowerCase() + '-' + organisation.toLowerCase() + '.' + process.env.BECKN_HOST_NAME
	try {
		// find if user already exists
		const user = await User.findOne({ subscriberId: subscriberId })
		if (user) {
			res.status(409).json({ message: 'BPP already exists' })
			return
		}
		const { publicKey, privateKey } = await createKeyPair()
		const newUser = new User({
			email,
			subscriberId,
			city,
			publicKey,
			privateKey
		})

		try {
			await createBPP(subscriberId, publicKey)
		}
		catch (err) {
			console.log('Axios Request ERROR', err)
			throw err
		}

		const attachments = {
			officer: await generateCertificate('Officer@' + subscriberId ,email),
			supervisor: await generateCertificate( 'Supervisor@' + subscriberId, email),
		}
		mailProducer(
			email,
			attachments,
			subscriberId
		)

		await newUser.save()
		res.status(201).json({ message: 'BPP dent' })
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Error registering BPP' })
	}
}
