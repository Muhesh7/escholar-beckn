'use strict'

exports.onSearchRequestDTO = async (context, items, categories, fulfillments, host) => {
	
	const formattedItems = items.map(item => {
		return {
			id: item._id,
			descriptor: item.descriptor,
			price: item.price,
			rateable: item.rateable,
			category_ids: item.category_ids,
			fulfillment_ids: item.fulfillment_ids,
			tags: item.tags || []
		}
	})

	return {
		context,
		responses: [
			{
				context,
				message : {
					catalog: {
						descriptor: {
							name: `DSEP Scholarships and Grants BPP Platform of ${host}`
						},
						providers: [
							{
								id: host,
								descriptor: {
									name: host
								},
								categories,
								fulfillments,
								items: formattedItems,
								rateable: false,
							}
						]
					},
				}
			}
		]
	}
}
