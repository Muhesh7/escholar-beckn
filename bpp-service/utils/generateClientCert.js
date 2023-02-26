'use strict'
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const generateCertificate = async (userId, userType) => {
	try {
		let privateKey = await exec('openssl ecparam -name prime256v1 -genkey -noout', {shell: '/bin/bash'})
		let signingRequest = await exec(`openssl req -new -sha256 -subj "/C=IN/ST=Tamil-Nadu/L=Tiruchirappalli/O=E-Scholar/CN=${userId}/OU=${userType}" -key <(echo "${privateKey.stdout}")`, {shell: '/bin/bash'})
		let clientCert = await exec(`openssl x509 -req -in <(echo "${signingRequest.stdout}") -CA /etc/apache2/ssl/ca/ca.crt -CAkey /etc/apache2/ssl/ca/ca.key -CAcreateserial -days 1000 -sha256 -passin pass:1234 2>/dev/null`, {shell: '/bin/bash'})
		let clientCertBase64 = await exec(`openssl pkcs12 -export -in <(echo "${clientCert.stdout}") -inkey <(echo "${privateKey.stdout}") -password pass:1234 | base64 -w 0`, {shell: '/bin/bash'})
		return clientCertBase64.stdout
	} catch (e) {
		console.log(e)
		throw 'Error'
	}
}

module.exports = { generateCertificate }
