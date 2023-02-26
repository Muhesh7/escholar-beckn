'use strict'

exports.onConfirmRequestDTO = async (context, item, form, formResponse, certificateId) => {
	return {
		context,
		responses: [
			{
				context,
				message: {
					order: {
						id: formResponse._id,
						status: formResponse.status || 'UNDEFINED',
						type: 'DEAFAULT',
						provider: {
							id: item.provider,
							descriptor: item.descriptor,
						},
						rateable: item.rateable,
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
									mime_type: 'application/json',
									data: formResponse.data,
									submission_id: formResponse.cid
								}
							},
							tags: item.tags || [],

						}
					],
					certificateId
				}
			}
		]
	}
}
