'use strict'
const router = require('express').Router()
const bap = require('../controllers/')
// const { authVerifier } = require('../middlewares/authVerifier')

router.get('/search', bap.search)
router.post('/init', bap.init)
router.post('/confirm', bap.confirm)
router.post('/select', bap.select)
router.post('/status', bap.status)

// router.post('/user-enrollment-status', bap.userEnrollmentStatus)
// router.get('/enrolled-sessions', bap.enrolledSessions)

// router.use(authVerifier)
router.post('/on_search', bap.onSearch)
router.post('/on_init', bap.onInit)
router.post('/on_confirm', bap.onConfirm)
router.post('/on_select', bap.onSelect)
router.post('/on_status', bap.onStatus)

module.exports = router
