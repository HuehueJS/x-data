import { expect } from 'chai';
import { XParser } from '../src/parser';
import { ParserRecipe } from '../src/index';
import { makeSimpleParser } from '../src/parser';

class Math {
    constructor(
        public a: number,
        public b: number
    ) {

    }

    multiply(): number {
        return this.a * this.b;
    }
}

const parserRecipe: ParserRecipe<Math> = {
    target: Math,
    nestedTargets: {
        a: (e) => e as number,
        b: (e) => e as number
    },
    multiple: false
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

    describe('#makeSimpleParser', () => {
        const simpleParser = makeSimpleParser(Math);
        it('should mutate the data', () => {
            const rawData = { a: 3, b: 5 };
            const mathData = simpleParser(rawData);
            expect(mathData.multiply()).to.equal(15);
        })
    })
});