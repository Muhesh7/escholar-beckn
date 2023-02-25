import { Object, Property } from 'fabric-contract-api';
import './state';
import { State } from './state';
import './transaction-info';
import { TransactionInfo } from './transaction-info';
import './user';
import { User } from './user';

@Object()
export class Scholarship {

    @Property()
    public id: number;

    @Property()
    public requester: User;

    @Property()
    public hash: string;

    @Property('completedStates', 'Array<State>')
    public completedStates: State[];

    @Property('nextState', 'State')
    public nextState: State | undefined;

    @Property('pendingStates', 'Array<State>')
    public pendingStates: State[];

    @Property()
    public currentStatus: 'Pending' | 'Completed' | 'Rejected';

    @Property('transactions', 'Array<TransactionInfo>')
    public transactions: TransactionInfo[];

    @Property()
    public name: string;

}
