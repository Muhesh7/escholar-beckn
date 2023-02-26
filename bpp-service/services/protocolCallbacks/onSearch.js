'use strict'

// const { internalRequests } = require('@helpers/requests')
const { contextBuilder } = require('@utils/contextBuilder')
const { descriptorBuilder } = require('@utils/descriptorBuilder')
const { onSearchRequestDTO } = require('@dtos/onSearchRequest')
const { externalRequests } = require('@helpers/requests')

exports.onSearch = async (callbackData) => {
	try {
		const context = await contextBuilder(
			callbackData.transactionId,
			callbackData.messageId,
			process.env.ON_SEARCH_ACTION,
			callbackData.bapId,
			callbackData.bapUri,
			callbackData.host,
		)
		// const response = await internalRequests.catalogPOST({
		// 	body: callbackData.message,
		// 	route: process.env.CATALOG_SEARCH_ROUTE,
		// })
		const {items, categories, fulfillments, host} = callbackData
		const response = { 
			'catalog': {
				'descriptor': {
					'name': 'Protean DSEP Scholarships and Grants BPP Platform'
				},
				'providers': [
					{
						'id': 'ZQU31169990',
						'descriptor': {
							'name': 'XYZ Education Foundation'
						},
						'categories': [
							{
								'id': 'DSEP_CAT_3',
								'descriptor': {
									'code': 'pg',
									'name': 'Post Graduate'
								}
							},
							{
								'id': 'DSEP_CAT_2',
								'descriptor': {
									'code': 'ug',
									'name': 'Undergraduate'
								}
							}
						],
						'fulfillments': [
							{
								'id': 'DSEP_FUL_58741444',
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
							},
							{
								'id': 'DSEP_FUL_70413991',
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
											'timestamp': '2023-01-20T00:00:00.000Z'
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
						],
						'items': [
							{
								'id': 'SCM_58741444',
								'descriptor': {
									'name': 'XYZ Undergraduation scholarship for Economically Backward Female Students',
									'long_desc': 'XYZ Undergraduation scholarship for Economically Backward Female Students'
								},
								'price': {
									'currency': 'INR',
									'value': '30000'
								},
								'rateable': false,
								'tags': [
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
												'value': 'Upto Rs.30000 per year',
												'display': true
											}
										]
									}
								],
								'category_ids': [
									'DSEP_CAT_2'
								],
								'fulfillment_ids': [
									'DSEP_FUL_58741444'
								]
							},
							{
								'id': 'SCM_70413991',
								'descriptor': {
									'name': 'XYZ Post Graduation scholarship for Economically Backward Female Students',
									'long_desc': 'XYZ Post Graduation scholarship for Economically Backward Female Students'
								},
								'price': {
									'currency': 'INR',
									'value': '45000'
								},
								'rateable': false,
								'tags': [
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
												'value': 'Upto Rs.45000 per year',
												'display': true
											}
										]
									}
								],
								'category_ids': [
									'DSEP_CAT_3'
								],
								'fulfillment_ids': [
									'DSEP_FUL_70413991'
								]
							}
						],
						'rateable': false
					}
				]
			} }
		
		const catalog = response.catalog
		catalog.descriptor = descriptorBuilder()
		const onSearchRequest = await onSearchRequestDTO(context, items, categories, fulfillments, host)
		console.log('###########')
		console.log('onSearchRequest: ', JSON.stringify(onSearchRequest))
		await externalRequests.callbackPOST({
			baseURL: callbackData.bapUri,
			route: process.env.ON_SEARCH_ROUTE,
			body: onSearchRequest,
			host
		})
	} catch (err) {
		console.log('OnSearch.ProtocolCallbacks.services: ', err)
	}
}
