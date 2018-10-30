import { expect } from 'chai';
import { XParser } from '../src/index';

export class Math {
    constructor(
        public a: number,
        public b: number
    ) {

    }

    multiply(): number {
        return this.a * this.b;
    }
}

describe('XParser', () => {

    const mathParser = new XParser(Math);

    describe('#mutate', () => {
        it('should mutate the data', () => {
            const rawData = { a: 3, b: 5 };
            const mathData = mathParser.mutate(rawData);
            expect(mathData.multiply()).to.equal(15);
        })
    })
});