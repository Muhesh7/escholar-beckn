const _sodium = require('libsodium-wrappers');
const { base64_variants } = require('libsodium-wrappers');

module.exports.createKeyPair = async () => {
    await _sodium.ready
    const sodium = _sodium
    let { publicKey, privateKey } = sodium.crypto_sign_keypair()
    const publicKey_base64 = sodium.to_base64(publicKey, base64_variants.ORIGINAL);
    const privateKey_base64 = sodium.to_base64(privateKey, base64_variants.ORIGINAL);

    return {
        privateKey: privateKey_base64,
        publicKey: publicKey_base64
    }
}
