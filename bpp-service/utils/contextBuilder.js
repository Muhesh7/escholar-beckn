'use strict'

exports.contextBuilder = async (transactionId, messageId, action, bapId, bapUri, host) => {
	return {
		domain: process.env.DOMAIN,
		action,
		bap_id: bapId,
		bap_uri: bapUri,
		bpp_id: host,
		bpp_uri: 'https://' + host + process.env.ROOT_ROUTE,
		timestamp: new Date(),
		ttl: process.env.BPP_TTL,
		version: process.env.SCHEMA_CORE_VERSION,
		message_id: messageId,
		transaction_id: transactionId,
	}
}
