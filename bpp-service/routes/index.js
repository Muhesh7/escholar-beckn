'use strict'
const router = require('express').Router()
const bppController = require('@controllers/')
const scholarshipController = require('@controllers/scholarships')
const { authVerifier } = require('@middlewares/authVerifier')

router.use(authVerifier)
router.post('/search', bppController.search)
router.post('/select', bppController.select)
router.post('/init', bppController.init)
router.post('/confirm', bppController.confirm)
// router.post('/cancel', bppController.cancel)
router.post('/status', bppController.status)

router.post('/scholarship/add', scholarshipController.addScholarship)
router.get('/scholarship/list', scholarshipController.getScholarships)
router.post('/scholarship/delete', scholarshipController.deleteScholarship)

router.post('/category/add', scholarshipController.addCategory)
router.get('/category/list', scholarshipController.getCategories)
// // router.post('/category/delete', scholarshipController.deleteCategory)
router.post('/fulfillment/add', scholarshipController.addFulfillment)
router.get('/fulfillment/list', scholarshipController.getFulfillments)

module.exports = router
