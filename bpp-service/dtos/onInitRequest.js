'use strict'

exports.onInitRequestDTO = async (context, messages) => {
	
	const responses = messages.map((message) => {
		return {
			context,
			message
		}
	})

	return {
		context,
		responses
	}
}
