'use strict'
require('module-alias/register')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('@configs/')
const mongoose = require('mongoose')
var logger = require('morgan')

// connect to mongoose
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}).then(() => {
	console.log('MongoDB connected')
}).catch((err) => {
	console.log(err)
	console.log('Error Connecting to mongo')
})

app.use(bodyParser.urlencoded({ extended: true, limit: '50MB' }))
app.use(bodyParser.json({ limit: '50MB' }))
app.use(logger('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'))
app.use(cors())

app.use(process.env.ROOT_ROUTE+ '/workflow' , require('@routes/workflow'))
app.use(process.env.ROOT_ROUTE+ '/form' , require('@routes/form'))
app.use(process.env.ROOT_ROUTE+ '/roles' , require('@routes/roles'))
app.use(process.env.ROOT_ROUTE, require('@routes'))

// app.use('*', (req,res)=> {
// 	console.log(req.url)
// 	res.status(404).send('404 Not Found')
	
// })

app.listen(process.env.APPLICATION_PORT, (res, err) => {
	if (err) onError(err)
	console.log('BPP Environment: ' + process.env.NODE_ENV)
	console.log('BPP is running on the port:' + process.env.APPLICATION_PORT)
})

function onError(error) {
	switch (error.code) {
		case 'EACCES':
			console.log(process.env.APPLICATION_PORT + ' requires elevated privileges')
			process.exit(1)
		// eslint-disable-next-line no-fallthrough
		case 'EADDRINUSE':
			console.log(process.env.APPLICATION_PORT + ' is already in use')
			process.exit(1)
		// eslint-disable-next-line no-fallthrough
		default:
			throw error
	}
}
