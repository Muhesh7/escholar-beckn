const fetch = require("node-fetch")

const headers = {
    "ApiKey": process.env.REGISTRY_API_KEY,
    "content-type": "application/x-www-form-urlencoded"
}

const createNetworkParticipant = async (participantID) => {
    const res = await fetch(process.env.REGISTRY_ENDPOINT + "/network_participants/index/network_participants/save",
        {
            "headers": headers,
            "body": `PARTICIPANT_ID=${participantID}&_SUBMIT_NO_MORE=Done`,
            "method": "POST"
        }
    )
    if (res.url.includes("show")) {
        return res.url.split("/").pop()
    } else {
        return false
    }
}

const uploadKeysForNetworkParticipant = async (participantID, publicKey, networkParticipantId) => {
    const urlencoded = {
        networkParticipantId: encodeURIComponent(networkParticipantId),
        participantID: encodeURIComponent(participantID),
        publicKey: encodeURIComponent(publicKey),
        validFrom: "25%2F02%2F2023+14%3A40%3A00",
        validTo: "04%2F03%2F2023+14%3A40%3A00"
    }
    const res = await fetch(process.env.REGISTRY_ENDPOINT + "/network_participants/index/network_participants/edit/" + networkParticipantId + "/participant_keys/save",
        {
            "headers": headers,
            "body": `NETWORK_PARTICIPANT_ID=${urlencoded.networkParticipantId}&KEY_ID=${urlencoded.participantID}&SIGNING_PUBLIC_KEY=${urlencoded.publicKey}&ENCR_PUBLIC_KEY=${urlencoded.publicKey}&VALID_FROM=${urlencoded.validFrom}&VALID_UNTIL=${urlencoded.validTo}&VERIFIED=true&_SUBMIT_NO_MORE=Done`,
            "method": "POST"
        }
    )
    if (res.url.includes("save")) {
        return false
    } else {
        return true
    }
}

const addNetworkRoles = async (networkParticipantId, participantID) => {
    const res = await fetch(process.env.REGISTRY_ENDPOINT + "/network_participants/index/network_participants/index/network_participants/index/network_participants/index/network_participants/edit/" + networkParticipantId + "/network_roles/save",
        {
            "headers": headers,
            "body": `NETWORK_DOMAIN_ID=135&SUBSCRIBER_ID=${participantID}&URL=https%3A%2F%2F${participantID}&STATUS=SUBSCRIBED&TYPE=BPP&NETWORK_PARTICIPANT_ID=${networkParticipantId}&_SUBMIT_NO_MORE=Done`,
            "method": "POST"
        }
    )
    if (res.url.includes("save")) {
        return false
    } else {
        return true
    }
}

const createBPP = async (participantID, publicKey) => {
    const networkParticipantId = await createNetworkParticipant(participantID)
    if (networkParticipantId) {
        const success = await uploadKeysForNetworkParticipant(participantID, publicKey, networkParticipantId)
        if (success) {
            const success = await addNetworkRoles(networkParticipantId, participantID)
            if (success) {
                return true
            } else {
                throw new Error("Failed to add network roles")
            }
        } else {
            throw new Error("Failed to upload keys")
        }
    } else {
        throw new Error("Failed to create network participant")
    }
}

module.exports = {
    createBPP
}

// test
// const { createKeyPair } = require("./keyPair")

// const test = async () => {
//     const participantID = "test" + Math.round(Math.random() * 1000)
//     createNetworkParticipant(participantID).then(async (networkParticipantId) => {
//         if (networkParticipantId) {
//             const { publicKey } = await createKeyPair();

//             uploadKeysForNetworkParticipant(participantID, publicKey, networkParticipantId).then((success) => {
//                 console.log("keys", success)
//             })
//             addNetworkRoles(networkParticipantId, participantID).then((success) => {
//                 console.log("role",success)
//             })
//         } else {
//             console.log("Network Participant already exists")
//         }
//     })
// }
