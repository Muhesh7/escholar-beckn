import { Object, Property } from 'fabric-contract-api';

@Object()
export class State {
    @Property()
    public status: string;

    @Property()
    public domain: string;

    @Property()
    public designation: 'Supervisor' | 'Officer' | 'Student';
}
