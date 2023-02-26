const blockchain = require("./blockchain");
require('dotenv').config();

const rand = Math.floor(Math.random() * 10000);

const student = { email: `student${rand}@benefactors.escholar.captainirs.dev`, role: "Student", domain: "student" };
const supervisor = { email: `supervisor${rand}@provider.escholar.captainirs.dev`, role: "Supervisor", domain: "org.bpp" };
const officer = { email: `officer${rand}@provider.escholar.captainirs.dev`, role: "Officer", domain: "org.bpp" };

const green = "\x1b[32m";
const clear = "\x1b[0m";

const approveTestFlow = async () => {
    console.log(`${green}Adding file to blockchain...${clear}`);
    const fileId = (await blockchain.createScholarship(
        student,
            [
                { status: "Approval by Supervisor", designation: "Supervisor", domain: "org.bpp" },
                { status: "Approval by Officer", designation: "Officer", domain: "org.bpp" },
            ],
            "hash1",
            "name1",
        )).toString();
    console.log(`${green}File added to blockchain with id: ${fileId}${clear}`);
    
    console.log(`${green}Getting file from blockchain...${clear}`);
    console.log((await blockchain.readScholarship(student, parseInt(fileId))).toString());

    console.log(`${green}Querying files of requester...${clear}`);
    console.log((await blockchain.queryScholarshipsOfRequester(student)).toString());

    console.log(`${green}Querying files of approver (supervisor) - Should return some files...${clear}`);
    console.log((await blockchain.queryScholarshipsOfApprover(supervisor)).toString());
  
    console.log(`${green}Querying files of approver (officer) - Should return nothing...${clear}`);
    console.log((await blockchain.queryScholarshipsOfApprover(officer)).toString());

    console.log(`${green}Approving file as officer (should fail)...${clear}`);
    try {
        await blockchain.approveScholarship(parseInt(fileId), officer, "hash2");
    } catch (e) {
        console.log(`${green}File approval failed as expected: ${e.message}${clear}`);
    }

    console.log(`${green}Approving file as supervisor (should succeed)...${clear}`);
    await blockchain.approveScholarship(parseInt(fileId), supervisor, "hash2");

    console.log(`${green}Querying files of requester...${clear}`);
    console.log((await blockchain.queryScholarshipsOfRequester(student)).toString());

    console.log(`${green}Querying files of approver (officer) - Should return some files...${clear}`);
    console.log((await blockchain.queryScholarshipsOfApprover(officer)).toString());

    console.log(`${green}Approving file as officer (should succeed)...${clear}`);
    await blockchain.approveScholarship(parseInt(fileId), officer, "hash3");

    console.log(`${green}Querying files of requester...${clear}`);
    console.log((await blockchain.queryScholarshipsOfRequester(student)).toString());

    console.log(`${green}Approving file as supervisor (should fail as no more approvals pending)...${clear}`);
    try {
        await blockchain.approveScholarship(parseInt(fileId), supervisor, "hash3");
    } catch (e) {
        console.log(`${green}File approval failed as expected: ${e.message}${clear}`);
    }

    console.log(`${green}Rejecting file as officer (should fail)...${clear}`);
    try {
        await blockchain.rejectScholarship(parseInt(fileId), officer);
    } catch (e) {
        console.log(`${green}File rejection failed as expected: ${e.message}${clear}`);
    }    
};

const rejectTestFlow = async () => {
    console.log(`${green}Adding file to blockchain...${clear}`);
    const fileId = (await blockchain.createScholarship(
        student,
            [
                { status: "Approval by Supervisor", designation: "Supervisor", domain: "org.bpp" },
                { status: "Approval by Officer", designation: "Officer", domain: "org.bpp" },
            ],
            "hash1",
            "name1",
        )).toString();
    console.log(`${green}File added to blockchain with id: ${fileId}${clear}`);

    console.log(`${green}Getting file from blockchain...${clear}`);
    console.log((await blockchain.readScholarship(student, parseInt(fileId))).toString());

    console.log(`${green}Querying files of requester...${clear}`);
    console.log((await blockchain.queryScholarshipsOfRequester(student)).toString());

    console.log(`${green}Rejecting file as officer (should fail)...${clear}`);
    try {
        await blockchain.rejectScholarship(parseInt(fileId), officer);
    } catch (e) {
        console.log(`${green}File rejection failed as expected: ${e.message}${clear}`);
    }

    console.log(`${green}Rejecting file as supervisor (should succeed)...${clear}`);
    await blockchain.rejectScholarship(parseInt(fileId), supervisor);

    console.log(`${green}Rejecting file as officer (should fail)...${clear}`);
    try {
        await blockchain.rejectScholarship(parseInt(fileId), officer);
    } catch (e) {
        console.log(`${green}File rejection failed as expected: ${e.message}${clear}`);
    }
}

const runTestFlow = async () => {
    console.log(`${green}Running test flow...${clear}`);
    await approveTestFlow();
    console.log(`${green}Approve test flow completed successfully${clear}`);
    await rejectTestFlow();
    console.log(`${green}Reject test flow completed successfully${clear}`);
}

runTestFlow().then(() => {
    console.log(`${green}Test flow completed successfully${clear}`);
});
