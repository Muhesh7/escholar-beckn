import { Context, Contract, Info, Param, Property, Returns, Transaction } from 'fabric-contract-api';
import { Scholarship } from './scholarship';
import './state';
import { State } from './state';
import './transaction-info';
import { TransactionInfo } from './transaction-info';
import './user';
import { User } from './user';

@Info({ title: 'ScholarshipContract', description: 'Contract for eScholar' })
export class ScholarshipContract extends Contract {
    @Property()
    scholarshipId: number;

    constructor() {
        super('ScholarshipContract');

        this.scholarshipId = 0;
    }

    @Transaction(false)
    @Returns('boolean')
    public async scholarshipExists(ctx: Context, scholarshipId: string): Promise<boolean> {
        console.log(`Checking if scholarship ${scholarshipId} exists`);
        const data: Uint8Array = await ctx.stub.getState(scholarshipId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    @Param('states', 'Array<State>')
    @Returns('number')
    public async createScholarship(ctx: Context, requester: User, states: State[], hash: string, name: string): Promise<number> {
        console.log(`Creating scholarship with requester ${JSON.stringify(requester)} and states ${JSON.stringify(states)}`);
        const scholarship: Scholarship = new Scholarship();
        const createdState: State = { status: 'Created', designation: requester.role };
        scholarship.requester = requester;
        scholarship.hash = hash;
        scholarship.pendingStates = states;
        scholarship.completedStates = [createdState];
        scholarship.name = name;
        scholarship.id = ++this.scholarshipId;
        if (scholarship.pendingStates.length > 0) {
            scholarship.nextState = scholarship.pendingStates[0];
            scholarship.currentStatus = 'Pending';
        } else {
            scholarship.nextState = null;
            scholarship.currentStatus = 'Completed';
        }
        const transactions: TransactionInfo[] = [
            {
                txId: ctx.stub.getTxID(),
                timestamp: new Date().toString(),
                message: 'Scholarship created'
            }
        ];
        scholarship.transactions = transactions;
        const buffer: Buffer = Buffer.from(JSON.stringify(scholarship));
        await ctx.stub.putState(`${this.scholarshipId}`, buffer);
        return this.scholarshipId;
    }

    @Transaction(false)
    @Returns('Scholarship')
    public async readScholarship(ctx: Context, scholarshipId: string): Promise<Scholarship> {
        console.log(`Reading scholarship ${scholarshipId}`);

        const exists: boolean = await this.scholarshipExists(ctx, scholarshipId);
        if (!exists) {
            throw new Error(`The scholarship ${scholarshipId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(scholarshipId);
        const scholarship: Scholarship = JSON.parse(data.toString()) as Scholarship;
        return scholarship;
    }

    @Transaction()
    public async approveScholarship(ctx: Context, scholarshipId: string, approver: User, newHash: string): Promise<void> {
        console.log(`Approving scholarship ${scholarshipId} by ${JSON.stringify(approver)}`);
        const exists: boolean = await this.scholarshipExists(ctx, scholarshipId);
        if (!exists) {
            throw new Error(`The scholarship ${scholarshipId} does not exist`);
        }
        const scholarship: Scholarship = await this.readScholarship(ctx, scholarshipId);
        if (scholarship.nextState === null) {
            throw new Error(`The scholarship ${scholarshipId} is already approved`);
        }
        if (scholarship.nextState.designation !== approver.role) {
            throw new Error(`The user ${approver.email} is not authorized to approve the scholarship ${scholarshipId}`);
        }
        scholarship.completedStates.push(scholarship.nextState);
        scholarship.pendingStates.shift();
        if (scholarship.pendingStates.length > 0) {
            scholarship.nextState = scholarship.pendingStates[0];
            scholarship.currentStatus = 'Pending';
        } else {
            scholarship.nextState = null;
            scholarship.currentStatus = 'Completed';
        }
        scholarship.hash = newHash;
        const transactions = scholarship.transactions;
        transactions.push({
            txId: ctx.stub.getTxID(),
            timestamp: new Date().toString(),
            message: `Scholarship approved by ${approver.email}`
        });
        scholarship.transactions = transactions;
        const buffer: Buffer = Buffer.from(JSON.stringify(scholarship));
        await ctx.stub.putState(scholarshipId, buffer);
    }

    @Transaction()
    public async rejectScholarship(ctx: Context, scholarshipId: string, rejector: User): Promise<void> {
        console.log(`Rejecting scholarship ${scholarshipId} by ${JSON.stringify(rejector)}`);
        const exists: boolean = await this.scholarshipExists(ctx, scholarshipId);
        if (!exists) {
            throw new Error(`The scholarship ${scholarshipId} does not exist`);
        }
        const scholarship: Scholarship = await this.readScholarship(ctx, scholarshipId);
        if (scholarship.nextState === null) {
            throw new Error(`The scholarship ${scholarshipId} is already processed`);
        }
        if (scholarship.nextState.designation !== rejector.role) {
            throw new Error(`The user ${rejector.email} is not authorized to reject the scholarship ${scholarshipId}`);
        }
        const rejectedState: State = { status: 'Rejected', designation: rejector.role };
        scholarship.completedStates.push(rejectedState);
        scholarship.nextState = null;
        scholarship.currentStatus = 'Rejected';
        const transactions = scholarship.transactions;
        transactions.push({
            txId: ctx.stub.getTxID(),
            timestamp: new Date().toString(),
            message: `Scholarship rejected by ${rejector.email}`
        });
        scholarship.transactions = transactions;
        const buffer: Buffer = Buffer.from(JSON.stringify(scholarship));
        await ctx.stub.putState(scholarshipId, buffer);
    }

    @Transaction(false)
    @Returns('Array<Scholarship>')
    async queryScholarshipsOfRequester(ctx: Context, requester: User): Promise<Scholarship[]> {
        console.log(`Querying scholarships of requester ${JSON.stringify(requester)}`);
        const query = {
            selector: {
                'requester.email': {
                    $eq: requester.email
                }
            }
        };
        const scholarships: Scholarship[] = [];
        for await (const { value } of ctx.stub.getQueryResult(JSON.stringify(query))) {
            const scholarship = JSON.parse(value.toString()) as Scholarship;
            scholarships.push(scholarship);
        }
        return scholarships;
    }

    @Transaction(false)
    @Returns('Array<Scholarship>')
    async queryScholarshipsOfApprover(ctx: Context, approver: User): Promise<Scholarship[]> {
        console.log(`Querying scholarships of approver ${JSON.stringify(approver)}`);
        const query = {
            selector: {
                nextState: {
                    designation: approver.role
                }
            }
        };
        const scholarships: Scholarship[] = [];
        for await (const { value } of ctx.stub.getQueryResult(JSON.stringify(query))) {
            const scholarship = JSON.parse(value.toString()) as Scholarship;
            scholarships.push(scholarship);
        }
        return scholarships;
    }
}
