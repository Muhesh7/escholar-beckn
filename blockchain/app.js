const { execSync } = require('child_process');
const express = require("express");
const app = new express();
var sha256File = require('sha256-file');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const execScript = (script, args = "") => {
    console.log(`scripts/${script}.sh ${args}`);
    try {
        let result = execSync(`scripts/${script}.sh ${args}`, {
            shell: '/bin/sh'
        });
        console.log(result.toString());
        return (result.toString());
    } catch (e) {
        console.log(e.toString())
        return (e.stdout.toString() + e.toString());
    }
}

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/node_modules/xterm/css/xterm.css', async (req, res) => {
    res.sendFile(__dirname + '/node_modules/xterm/css/xterm.css');
})

app.get('/node_modules/xterm/lib/xterm.js', async (req, res) => {
    res.sendFile(__dirname + '/node_modules/xterm/lib/xterm.js');
})

const args = {
    setenv: [],
    cleanup: [],
    checkPrereqs: [],
    cleanupOrgs: [],
    createPeerOrg_Provider: ['Provider', 'provider', 'escholar.captainirs.dev', 7051, 7054],
    createPeerOrg_Benefactors: ['Benefactors', 'benefactors', 'escholar.captainirs.dev', 9051, 8054],
    createOrdererOrg: ['escholar.captainirs.dev'],
    networkUp: [],
    createChannel: ['scholarshipchannel', 'Provider', 'provider', 'escholar.captainirs.dev', 0, 7051, "TwoOrgsApplicationGenesis"],
    joinChannel_Provider: ['scholarshipchannel', 'Provider', 'provider', 'escholar.captainirs.dev', 0, 7051],
    joinChannel_Benefactors: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051],
    setAnchorPeer_Provider: ['scholarshipchannel', 'Provider', 'provider', 'escholar.captainirs.dev', 0, 7051],
    setAnchorPeer_Benefactors: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051],
    deployChainCode_Provider: ['scholarshipchannel', 'Provider', 'provider', 'escholar.captainirs.dev', 0, 7051, 'scholarships', '../chaincode/scholarships'],
    deployChainCode_Benefactors: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051, 'scholarships', '../chaincode/scholarships'],
    checkChainCodeCommitReadiness: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051, 'scholarships'],
    approveChainCode_Provider: ['scholarshipchannel', 'Provider', 'provider', 'escholar.captainirs.dev', 0, 7051, 'scholarships'],
    approveChainCode_Benefactors: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051, 'scholarships'],
    commitChainCode: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051, 'scholarships'],
    queryCommitted: ['scholarshipchannel', 'Benefactors', 'benefactors', 'escholar.captainirs.dev', 0, 9051, 'scholarships'],
    networkDown: []
}

app.get('/scripts/:script', (req, res) => {
    var script = req.params.script;
    var scriptArgs = args[script];
    if (script === 'approveChainCode_Provider' || script === 'approveChainCode_Benefactors') {
        var sha256 = sha256File(__dirname + '/scholarships.tar.gz');
        console.log(`SHA256: ${sha256}`);
        scriptArgs.push(`scholarships_1.0:${sha256}`);
    }
    let result = execScript(script.split('_')[0], scriptArgs?.join(' ') ?? '');
    res.send(result);
})

app.listen(3009, () => {
	console.log(`App running on port: 3009`);
});
