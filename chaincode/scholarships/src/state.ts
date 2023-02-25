import { Object, Property } from 'fabric-contract-api';

@Object()
export class State {
    @Property()
    public status: string;

    @Property()
    public designation: 'HoD' | 'Doctor' | 'Patient';
}
