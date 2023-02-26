'use strict'
var create = require('ipfs-http-client')

var ipfs = create({
	host: `${process.env.IPFS_HOST || 'localhost'}`,
	port: '5001',
	protocol: 'http'
})

module.exports = ipfs