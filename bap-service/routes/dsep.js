'use strict'
const dsep = require('express').Router()
const controller = require('../controllers/')
// const { authVerifier } = require('../middlewares/authVerifier')

dsep.post('/search', controller.search)
dsep.post('/init', controller.init)
dsep.post('/confirm', controller.confirm)
dsep.post('/select', controller.select)
dsep.post('/status', controller.status)

module.exports = dsep
