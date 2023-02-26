var all = require('it-all');
var stream = require('stream');
var uint8ArrayConcat = require('uint8arrays/concat').concat;
const {  readScholarship, queryScholarshipsOfRequester } = require('../utils/blockchain');
var ipfs = require('../utils/ipfs');
const blockchain = require('express').Router()


blockchain.get('/response/doc_status/:id', async (req, res) => {
    if (!req.user) return res.status(401).send({message: 'Unauthorized'});
    const { email, role } = req.user;
    const user = { email, role };
    console.log(user)
    try {
        const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(user));
        const result = requesterCertificates.find(certificate => certificate.id === parseInt(req.params.id));
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message: 'Failed to get certificate status'});
    }
})


blockchain.get('/response/file/:id/:email/:role', async (req, res) => {
    console.log(req.body)
    const { email, role } = req.params;
    const requester = { email, role };
    try {
        const certificate = JSON.parse(await readScholarship(requester, parseInt(req.params.id)));
        if (!certificate) {
            res.status(404).json({message: 'Certificate not found'});
        }
        const fileBuffer = uint8ArrayConcat(await all(ipfs.cat(certificate.hash)));
        const readStream = new stream.PassThrough();

        readStream.end(fileBuffer);
        res.set('Content-Disposition', 'inline');
        res.set('Content-Type', 'application/pdf');
        readStream.pipe(res);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message: 'Failed to get file'});
    }
})


blockchain.get('/response/approved', async (req, res) => {
    if (!req.user) return res.status(401).send({message: 'Unauthorized'});
    const { email, role } = req.user;
    const requester = { email, role };
    try {
        const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester));
        res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Completed'));
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message: 'Failed to get approved certificates'});
    }
})

blockchain.get('/response/rejected', async (req, res) => {
    if (!req.user) return res.status(401).send({message: 'Unauthorized'});
    const { email, role } = req.user;
    const requester = { email, role };
    try {
        const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester));
        res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Rejected'));
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message: 'Failed to get rejected certificates'});
    }
})

blockchain.get('/response/processing', async (req, res) => {
    if (!req.user) return res.status(401).send({message: 'Unauthorized'});
    const { email, role } = req.user;
    const requester = { email, role };
    try {
        const requesterCertificates = JSON.parse(await queryScholarshipsOfRequester(requester));
        res.json(requesterCertificates.filter(certificate => certificate.currentStatus === 'Pending'));
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message: 'Failed to get pending certificates'});
    }
})

module.exports = blockchain;