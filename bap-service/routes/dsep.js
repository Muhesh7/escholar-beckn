'use strict'
const dsep = require('express').Router()
const controller = require('../controllers/')
// const { authVerifier } = require('../middlewares/authVerifier')

dsep.post('/search', controller.search)
dsep.post('/init', controller.init)
dsep.post('/confirm', controller.confirm)
dsep.post('/select', controller.select)
dsep.post('/status', controller.status)

// dsep.use(authVerifier)
dsep.post('/on_search', controller.onSearch)
dsep.post('/on_init', controller.onInit)
dsep.post('/on_confirm', controller.onConfirm)
dsep.post('/on_select', controller.onSelect)
dsep.post('/on_status', controller.onStatus)

module.exports = dsep