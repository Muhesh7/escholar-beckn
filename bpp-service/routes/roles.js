'use strict'
var express = require('express')
var router = express.Router()


router.get('/list', async function (req, res) {
	const roles = ['Supervisor', 'Officer']
	res.status(200).json(roles)
})

module.exports = router