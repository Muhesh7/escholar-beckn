'use strict'

const protocolCallbacks = require('@services/protocolCallbacks/')
// const bapQueries = require('@database/storage/bap/queries')
const Item = require('@models/Item')
exports.search = async (requestBody) => {
	try {
		const context = requestBody.context
		const message = requestBody.message
		// const { bap } = await bapQueries.findOrCreate({
		// 	where: { bapId: context.bap_id, bapUri: context.bap_uri },
		// })
		const bap = {
			bapId: context.bap_id,
			bapUri: context.bap_uri,
		}
		const scholarshipName = message?.intent?.item?.descriptor?.name
		const gender = message?.intent?.fulfillment?.customer?.person?.gender
		const courseCategory = message?.intent?.provider?.categories[0]?.descriptor?.code
			
		const host = requestBody.host.split(', ')[0]
		console.log(`Scholarship Search Request by ${host}: `, scholarshipName,gender, courseCategory )

		const categories = [
			{
				'id': 'DSEP_CAT_1',
				'descriptor': {
					'code': 'ug',
					'name': 'Undergraduate'
				}
			},
			{
				'id': 'DSEP_CAT_2',
				'descriptor': {
					'code': 'pg',
					'name': 'Postgraduate'
				}
			}
		]

		const fulfillments = [
			{
				'id': 'DSEP_FUL_1',
				'type': 'SCHOLARSHIP',
				'tracking': false,
				'contact': {
					'phone': '9876543210',
					'email': 'maryg@xyz.com'
				},
				'stops': [
					{
						'type': 'APPLICATION-START',
						'time': {
							'timestamp': '2023-01-01T00:00:00.000Z'
						}
					},
					{
						'type': 'APPLICATION-END',
						'time': {
							'timestamp': '2023-03-31T00:00:00.000Z'
						}
					}
				]
			}
		]

		let items = await Item.find({
			provider: host
		})
		if(scholarshipName!==undefined) {
			items = await Item.find({
				provider: host,
				'descriptor.name': scholarshipName
			})
			// console.log('items', items)
		}
		// if(gender!==undefined) {
		// 	// host: 
		// }
		// if(courseCategory!==undefined) {

		// }

		// const message = items.map(item => {
		
		// Generate message from items  

		console.log('Items Searched', items)
		await protocolCallbacks.onSearch({
			transactionId: context.transaction_id,
			messageId: context.message_id,
			bapId: bap.bapId,
			bapUri: bap.bapUri,
			items,
			categories,
			fulfillments,
			host
		})
	} catch (err) {
		console.log(err)
	}
}
