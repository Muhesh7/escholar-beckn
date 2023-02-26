'use strict';

const fs = require('fs');
const path = require('path');

exports.buildCCPProvider = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain', 'organizations', 'peerOrganizations', 'provider.escholar.captainirs.dev', 'connection-provider.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

exports.buildCCPBenefactors = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain',
		'organizations', 'peerOrganizations', 'benefactors.escholar.captainirs.dev', 'connection-benefactors.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

exports.buildWallet = async (Wallets, dbName) => {
	let wallet = await Wallets.newCouchDBWallet('http://admin:adminpw@localhost:5984', dbName);

	return wallet;
};

exports.prettyJSONString = (inputString) => {
	if (inputString) {
		 return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		 return inputString;
	}
}