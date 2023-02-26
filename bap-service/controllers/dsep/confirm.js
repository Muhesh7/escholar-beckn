'use strict'
const requester = require('../../utils/requester')
const { requestBodyGenerator } = require('../../utils/requestBodyGenerator')
const { v4: uuidv4 } = require('uuid')
const ipfs = require('../../utils/ipfs')

exports.confirm = async (req, res) => {
	try {
		console.log(JSON.stringify(req.body))
        const { formId, fileName, formData, context } = req.body;
		const contextObj = JSON.parse(context);
		const transactionId = contextObj.transaction_id
		const messageId = uuidv4()
		const bppUri = contextObj.bpp_uri
        const provider = contextObj.provider
		const items = contextObj.items
		const fulfillments = contextObj.fulfillments
        const fileBuffer = Buffer.from(req.body.base64, 'base64');
        const ipfsFile = await ipfs.add(fileBuffer);
        const hash = ipfsFile.cid.toString();
        const email = req.user.email
        await ipfs.files.cp(`/ipfs/${hash}`, `/${hash}.pdf`);
        items[0].xinput.form = {
            ...items[0].xinput.form,
            data: formData,
            submission_id: hash,
        }
		await requester.postRequest(
			bppUri + '/confirm',
			{},
			requestBodyGenerator('bpp_confirm', { provider, items, fulfillments, email, fileName }, transactionId, messageId),
			{ shouldSign: true }
		)
		res.redirect("https://beckn.muhesh.studio/home");
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}