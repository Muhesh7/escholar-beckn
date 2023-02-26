'use strict'
const axios = require('axios')
const { createAuthorizationHeader } = require('./auth')

exports.postRequest = async (url, headers, body, { shouldSign }) => {
	if (shouldSign) {
		headers = { ...headers, authorization: await createAuthorizationHeader(body) }
	}
	return new Promise((resolve, reject) => {
		axios({ method: 'post', url, data: body, headers, timeout: 3000 })
			.then((res) => {
				// console.log(res.data)
				resolve(res)
			})
			.catch((error) => {
				console.log(error)
				reject(error)
			})
	})
}
