'use strict'
var express = require('express')
var router = express.Router()
const axios = require('axios')
const Form = require('@models/Form')
const FormResponse = require('@models/FormResponse')
const bppController = require('@controllers/')

var ipfs = require('../utils/ipfs')
var all = require('it-all')
var stream = require('stream')
var uint8ArrayConcat = require('uint8arrays/concat').concat


const {
	queryScholarshipsOfRequester,
	queryScholarshipsOfApprover,
	getBlockchainUser,
	readScholarship,
	approveScholarship
} = require('../utils/blockchain')
router.post('/create_form', async function (req, res) {
	const { name, data, workflow } = req.body
	let host = req.hostname.split('.')[0]
	host = host + '.' + process.env.BECKN_HOST_NAME
	console.log('Creating form', host)
	try {
		const form = new Form({
			name: name,
			data: data,
			workflow: workflow,
			host: host
		})
		await form.save()
		res.status(200).json({ message: 'Form Created' })
	} catch (err) {
		console.error(err)
		res.status(500).send({ message: 'Error creating form' })
	}
})

router.post('/update_form', async function (req, res) {
	const { name, data, id, workflow } = req.body
	try {
		const form = await Form.findById(id)
		form.name = name
		form.data = data
		form.workflow = workflow
		await form.save()
		res.status(200).json({ message: 'Form Updated' })
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: `Error updating form ${id}` })
	}
})

router.delete('/delete_form', async function (req, res) {
	const { id } = req.query
	try {
		const form = await Form.findById(id)
		await form.remove()
		res.status(200).json({ message: 'Form Deleted' })
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: `Error deleting form: ${id}` })
	}
})

router.get('/form_list', async function (req, res) {
	try {
		let host = req.hostname.split('.')[0]
		host = host + '.' + process.env.BECKN_HOST_NAME
		console.log('Fetching form list', host)
		const forms = await Form.find({
			host: host
		})
		res.json(forms)
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to fetch form list' })
	}
})

router.get('/get_form', async function (req, res) {
	try {
		const form = await Form.findById(req.query.id)
		let savedResponse
		try {
			savedResponse = await FormResponse.find({ form: req.query.id, email: req.user.email })
		} catch (err) {
			console.log('No saved response')
		}
		if (form) {
			if (savedResponse) {
				res.send({ form: form, saved_response: savedResponse })
			} else {
				res.send({ form: form })
			}
		} else {
			res.send({ message: `Failed to get ${req.query.id}` })
		}
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: `Failed to get ${req.query.id}` })
	}
})

router.get('/response/file/:id/:email/:role', async (req, res) => {
	const { email, role } = req.params
	const requester = { email, role }
	try {
		const certificate = JSON.parse(await readScholarship(requester, parseInt(req.params.id)))
		if (!certificate) {
			res.status(404).json({ message: 'Certificate not found' })
		}
		const fileBuffer = uint8ArrayConcat(await all(ipfs.cat(certificate.hash)))
		const readStream = new stream.PassThrough()

		readStream.end(fileBuffer)
		res.set('Content-Disposition', 'inline')
		res.set('Content-Type', 'application/pdf')
		readStream.pipe(res)
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get file' })
	}
})

///
router.get('/response/approved', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	const requester = { email, role }
	try {
		const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester))
		res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Completed'))
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get approved certificates' })
	}
})

router.get('/response/rejected', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	const requester = { email, role }
	try {
		const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester))
		res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Rejected'))
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get rejected certificates' })
	}
})

router.get('/response/processing', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	const requester = { email, role }
	try {
		const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester))
		res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Pending'))
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get pending certificates' })
	}
})

router.get('/response/toapprove', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	if (role === 'Patient') return res.status(401).send({ message: 'Unauthorized' })
	const approver = { email, role }
	try {
		const certificates = JSON.parse(await queryScholarshipsOfApprover(approver))
		certificates.forEach(certificate => { if (!certificate.name) certificate.name = 'Certificate from ' + certificate.requester.email })
		res.json(certificates.filter(certificate => certificate.nextState.designation === approver.role))
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get certificates to be approved' })
	}
})

router.get('/response/doc_status/:id', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	const user = { email, role }
	try {
		const requesterCertificates = role === 'Patient' ? JSON.parse(await queryScholarshipsOfRequester(user)) : JSON.parse(await queryScholarshipsOfApprover(user))
		const result = requesterCertificates.find(certificate => certificate.id === parseInt(req.params.id))
		res.json(result)
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get certificate status' })
	}
})

router.get('/response/landing', async (req, res) => {
	// if(!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	if (role !== 'Patient') return res.status(401).send({ message: 'Unauthorized' })

	try {
		const user = { email, role }
		const userCertificates = JSON.parse(await queryScholarshipsOfRequester(user))

		const approved = []
		const pending = []

		userCertificates.every((doc) => {
			if (approved.length === 3 && pending.length === 3) {
				return false
			}

			if (approved.length !== 3) {
				if (doc.currentStatus === 'Completed') {
					approved.push(doc)
				}
			}

			if (pending.length !== 3) {
				if (doc.currentStatus === 'Pending') {
					pending.push(doc)
				}
			}

			return true
		})

		res.json({ approved, pending })
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get landing details' })
	}
})

router.get('/all', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]
	try {
		let forms = await Form.find({})
		if (role === 'Patient') {
			const requester = { email, role }
			const certificates = JSON.parse(await queryScholarshipsOfRequester(requester))
			forms = forms.filter(form => {
				const filteredDocs = certificates.find(doc => doc.formId === form._id)
				return !filteredDocs || filteredDocs.every(doc => doc.currentStatus === 'Rejected')
			}
			)
		}
		res.json(forms)
	}
	catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Failed to get forms' })
	}
})

router.patch('/response/:id/approve', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]

	console.log('Approving certificate with id: ' + req.params.id)
	console.log('Approver: ' + email + ' ' + role)

	let host = req.hostname.split('.')[0]
	host = host + '.' + process.env.BECKN_HOST_NAME

	const approver = { email, role, domain: host }
	let blockChainUser
	try {
		blockChainUser = await getBlockchainUser(approver)
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: 'Failed to get block chain user' })
	}
	let currentHash, pendingStages
	try {
		const certificate = JSON.parse(await readScholarship(approver, parseInt(req.params.id)))
		currentHash = certificate.hash
		pendingStages = certificate.pendingStates
		// let transactions = certificate.transactions
		if (!certificate) {
			return res.status(404).json({ message: 'Certificate not found' })
		}
		if (certificate.nextState === null) {
			return res.status(400).json({ message: 'Certificate already approved' })
		}
		if (certificate.nextState.designation !== approver.role) {
			return res.status(401).json({ message: 'Unauthorized' })
		}
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: 'Failed to get file' })
	}
	try {
		let isFinal = false
		if (pendingStages.length === 1) {
			isFinal = true
		}
		const response = await axios.post(process.env.SIGNER_ENDPOINT, {
			cert: blockChainUser.credentials.certificate,
			key: blockChainUser.credentials.privateKey,
			cid: currentHash,
			final: isFinal
		})
		const responseJson = response.data
		let newHash = responseJson.cid
		await approveScholarship(parseInt(req.params.id), approver, newHash)
		res.json({ message: 'Approved' })
	}
	catch (err) {
		console.log('patch approve error', err)
		return res.status(500).json({ message: 'Failed to approve certificate' })
	}
})

router.patch('/response/:id/reject', async (req, res) => {
	// if (!req.user) return res.status(401).send({message: 'Unauthorized'})
	const email = req.headers['x-user'].match(/OU=(.*?),/)[1]
	const role = req.headers['x-user'].match(/CN=(.*?),/)[1].split('@')[0]

	let host = req.hostname.split('.')[0]
	host = host + '.' + process.env.BECKN_HOST_NAME
	const rejector = { email, role, domain: host }
	try {
		const certificate = JSON.parse(await readScholarship(rejector, parseInt(req.params.id)))
		if (!certificate) {
			return res.status(404).json({ message: 'Certificate not found' })
		}
		if (certificate.nextState === null) {
			return res.status(400).json({ message: 'Certificate already processed' })
		}
		if (certificate.nextState.designation !== rejector.role) {
			return res.status(401).json({ message: 'Unauthorized' })
		}
	}
	catch (err) {
		console.log(err)
		return res.status(500).send({ message: 'Failed to get file' })
	}
	try {
		await readScholarship(parseInt(req.params.id), rejector)
		res.json({ message: 'Rejected' })
	}
	catch (err) {
		console.log(err)
		return res.status(500).json({ message: 'Failed to reject certificate' })
	}
})

router.post('/create', bppController.create)

//////
module.exports = router