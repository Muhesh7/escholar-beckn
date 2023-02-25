import { Object, Property } from 'fabric-contract-api';

@Object()
export class TransactionInfo {
    @Property()
    txId: string;

    @Property()
    timestamp: string;

    @Property()
    message: string;
}
