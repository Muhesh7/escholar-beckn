'use strict'
const Kafka = require('node-rdkafka')

const kafkastream = Kafka.Producer.createWriteStream(
	{
		'metadata.broker.list': 'localhost:9092',
	},
	{},
	{
		topic: 'mail',
	}
)

kafkastream.on('error', (err) => {
	console.error('Error in our kafka stream')
	console.error(err)
})

function mailProducer(email, attachment) {
	console.log(attachment)
	const success = kafkastream.write(JSON.stringify({ to: email, attachment }))
	console.log(success)
	if (success) {
		console.log('message queued')
	} else {
		console.log('Too many messages in the queue already..')
	}
}

module.exports = mailProducer