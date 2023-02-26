'use strict'

// const { internalRequests } = require('@helpers/requests')
const { contextBuilder } = require('@utils/contextBuilder')
const { onSelectRequestDTO } = require('@dtos/onSelectRequest')
const { externalRequests } = require('@helpers/requests')

exports.onSelect = async (callbackData) => {
	try {
		const context = await contextBuilder(
			callbackData.transactionId,
			callbackData.messageId,
			process.env.ON_SELECT_ACTION,
			callbackData.bapId,
			callbackData.bapUri,
			callbackData.host,
		)
		// const response = await internalRequests.catalogGET({
		// 	route: process.env.CATALOG_GET_SESSION_ROUTE,
		// 	pathParams: {
		// 		sessionId: callbackData.sessionId,
		// 	},
		// 	queryParams: {
		// 		getAllComponents: true,
		// 	},
		// })
		
		const response = [ {
			'order': {
				'type': 'DEFAULT',
				'provider': {
					'id': 'ZQU31169990',
					'descriptor': {
						'name': 'XYZ Education Foundation',
						'short_desc': 'XYZ Education Foundation'
					},
					'rateable': false
				},
				'items': [
					{
						'id': 'SCM_55274212',
						'descriptor': {
							'name': 'XYZ Education Scholarship for Undergraduate Students',
							'short_desc': 'XYZ Education Scholarship for Undergraduate Students'
						},
						'price': {
							'currency': 'INR',
							'value': '25000'
						},
						'xinput': {
							'required': true,
							'form': {
								'url': 'https://proteanrc.centralindia.cloudapp.azure.com/dsep-bpp-1/public/getForm/edea17fa-b5c4-48c9-86dd-1b80dda67d37/43226940255449c0b8228718689fd137',
								'mime_type': 'text/html'
							}
						},
						'rateable': false,
						'tags': [
							{
								'display': true,
								'descriptor': {
									'code': 'edu_qual',
									'name': 'Academic Eligibility'
								},
								'list': [
									{
										'descriptor': {
											'code': 'gr',
											'name': 'Grade'
										},
										'value': 'Grade 12',
										'display': true
									},
									{
										'descriptor': {
											'code': 'percentage_grade',
											'name': 'Percentage/Grade'
										},
										'value': '>= 50',
										'display': true
									},
									{
										'descriptor': {
											'code': 'passing_year',
											'name': 'Passing Year'
										},
										'value': '2022',
										'display': false
									}
								]
							},
							{
								'display': true,
								'descriptor': {
									'code': 'benefits',
									'name': 'Benefits'
								},
								'list': [
									{
										'descriptor': {
											'code': 'scholarship-amount',
											'name': 'Scholarship Amount'
										},
										'value': 'Upto Rs.25000 per year',
										'display': true
									}
								]
							}
						],
						'category_ids': [
							'DSEP_CAT_2'
						]
					}
				],
				'fulfillments': [
					{
						'id': 'DSEP_FUL_55274212',
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
			}
		}]

		// const session = response.session
		// const messages = response
		// const onSelectRequest = await onSelectRequestDTO(context, session.providers[0])
		const onSelectRequest = await onSelectRequestDTO(context, callbackData.item, callbackData.form)
		console.log('######')
		console.log('onSelectRequest: ', JSON.stringify(onSelectRequest))
		await externalRequests.callbackPOST({
			baseURL: callbackData.bapUri,
			route: process.env.ON_SELECT_ROUTE,
			body: onSelectRequest,
			host: callbackData.host,
		})
	} catch (err) {
		console.log('OnSelect.ProtocolCallbacks.services: ', err)
	}
}
