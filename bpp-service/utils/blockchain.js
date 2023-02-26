'use strict'
const fabricNetwork = require('fabric-network')
const FabricCAServices = require('fabric-ca-client')

const AppUtil = require('./blockchain/AppUtil')
const CAUtil = require('./blockchain/CAUtil')

const channelName = 'scholarshipchannel'
const chaincodeId = 'scholarships'

const providerConnectionProfile = AppUtil.buildCCPProvider()
const providerCA = CAUtil.buildCAClient(
	FabricCAServices,
	providerConnectionProfile,
	'ca.provider.escholar.captainirs.dev'
)

const benefactorsConnectionProfile = AppUtil.buildCCPBenefactors()
const benefactorsCA = CAUtil.buildCAClient(
	FabricCAServices,
	benefactorsConnectionProfile,
	'ca.benefactors.escholar.captainirs.dev'
)

module.exports.enrollStudent = async (email) => {
	const wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'benefactors_wallet')
	await CAUtil.enrollAdmin(benefactorsCA, wallet, 'BenefactorsMSP')
	return await CAUtil.registerAndEnrollUser(benefactorsCA, wallet, 'BenefactorsMSP', email, 'benefactors.student')
}

module.exports.enrollSupervisor = async (email) => {
	const wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'provider_wallet')
	await CAUtil.enrollAdmin(providerCA, wallet, 'ProviderMSP')
	return await CAUtil.registerAndEnrollUser(providerCA, wallet, 'ProviderMSP', email, 'provider.supervisor')
}

module.exports.enrollOfficer = async (email) => {
	const wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'provider_wallet')
	await CAUtil.enrollAdmin(providerCA, wallet, 'ProviderMSP')
	return await CAUtil.registerAndEnrollUser(providerCA, wallet, 'ProviderMSP', email, 'provider.officer')
}

const performTransaction = async (user, transactionName, transactionType, ...args) => {
	if (!['Supervisor', 'Officer', 'Student'].includes(user.role)) {
		throw new Error('Invalid user')
	}
	let wallet
	if (user.role === 'Student') {
		wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'benefactors_wallet')
		await CAUtil.enrollAdmin(benefactorsCA, wallet, 'BenefactorsMSP')
		await CAUtil.registerAndEnrollUser(benefactorsCA, wallet, 'BenefactorsMSP', user.email, '.')
	} else if (user.role === 'Supervisor' || user.role === 'Officer') {
		wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'provider_wallet')
		let affiliation
		if (user.role === 'Supervisor') {
			affiliation = 'provider.supervisor'
		} else {
			affiliation = 'provider.officer'
		}
		await CAUtil.enrollAdmin(providerCA, wallet, 'ProviderMSP')
		await CAUtil.registerAndEnrollUser(providerCA, wallet, 'ProviderMSP', user.email, affiliation)
	}
	const gatewayOptions = {
		identity: user.email,
		wallet,
	}
	if (process.env.REMOTE === 'true') {
		gatewayOptions.discovery = { enabled: true, asLocalhost: false }
	}
	const gateway = new fabricNetwork.Gateway()
	if (user.role === 'Student') {
		await gateway.connect(benefactorsConnectionProfile, gatewayOptions)
	} else if (user.role === 'Supervisor' || user.role === 'Officer') {
		await gateway.connect(providerConnectionProfile, gatewayOptions)
	}
	const network = await gateway.getNetwork(channelName)
	const contract = network.getContract(chaincodeId)
	let result
	if (transactionType === 'submit') {
		result = await contract.submitTransaction(transactionName, ...args)
	} else if (transactionType === 'evaluate') {
		result = await contract.evaluateTransaction(transactionName, ...args)
	}
	console.log(
		`Transaction has been evaluated, result is: ${result.toString()}`
	)
	gateway.disconnect()

	return result
}


module.exports.createScholarship = async (requester, states, hash, name) => {
	return await performTransaction(requester, 'createScholarship', 'submit', JSON.stringify(requester), JSON.stringify(states), hash, name)
}

module.exports.readScholarship = async (requester, fileId) => {
	return await performTransaction(requester, 'readScholarship', 'evaluate', JSON.stringify(fileId))
}

module.exports.approveScholarship = async (fileId, approver, hash) => {
	return await performTransaction(approver, 'approveScholarship', 'submit', JSON.stringify(fileId), JSON.stringify(approver), hash)
}

module.exports.rejectScholarship = async (fileId, rejector) => {
	return await performTransaction(rejector, 'rejectScholarship', 'submit', JSON.stringify(fileId), JSON.stringify(rejector))
}

module.exports.queryScholarshipsOfRequester = async (requester) => {
	return await performTransaction(requester, 'queryScholarshipsOfRequester', 'evaluate', JSON.stringify(requester))
}

module.exports.queryScholarshipsOfApprover = async (approver) => {
	return await performTransaction(approver, 'queryScholarshipsOfApprover', 'evaluate', JSON.stringify(approver))
}

module.exports.getBlockchainUser = async (user) => {
	if (user.role === 'Student') {
		const wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'benefactors_wallet')
		return await wallet.get(user.email)
	} else if (user.role === 'Supervisor' || user.role === 'Officer') {
		const wallet = await AppUtil.buildWallet(fabricNetwork.Wallets, 'provider_wallet')
		return await wallet.get(user.email)
	}
}
