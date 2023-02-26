'use strict'

exports.onSelectRequestDTO = async (context, item, form) => {
	// const responses = messages.map((message) => {
	// 	return {
	// 		context,
	// 		message
	// 	}
	// })
	console.log('SELECTED FORM IN DTO', form)

	return {
		context,
		responses: [
			{
				context,
				message: {
					order: {
						type: 'DEAFAULT',
						provider: {
							id: item.provider,
						},
					},
					items: [
						{
							id: item.id,
							descriptor: item.descriptor,
							price: item.price,
							rateable: item.rateable,
							xinput: {
								required: true,
								form: {
									url: form.data,
									mime_type: 'application/json'
								}
							},
							tags: item.tags || [],

						}
					] 
				}
			}
		]
	}
}
