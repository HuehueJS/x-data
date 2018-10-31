import { expect } from 'chai';
import { XParser } from '../src/parser';
import { ParserRecipe } from '../src/index';
import { makeSimpleParser } from '../src/parser';
import { makeFromRecipe } from '../src/parser';

const rawMathData = () => ({ a: 3, b: 5 });

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

const checkBehavior = (mathData: Math) => {
    expect(mathData.multiply()).to.equal(15);
}

describe('XParser', () => {

    const mathParser = new XParser(Math);

    describe('#mutate', () => {
        it('should mutate the data', () => {
            const rawData = rawMathData();
            const mathData = mathParser.mutate(rawData);
            checkBehavior(mathData);
        })
    })

    describe('#makeSimpleParser', () => {
        const simpleParser = makeSimpleParser(Math);
        it('should mutate the data', () => {
            const rawData = rawMathData();
            const mathData = simpleParser(rawData);
            checkBehavior(mathData);
        })
    })

    describe("#makeFromRecipe", () => {
        it('should work with only a type', () => {
            const justAType: ParserRecipe<Math> = Math;
            const rawData = rawMathData();
            const parser = makeFromRecipe(justAType);
            const mathData = parser(rawData);
            checkBehavior(mathData);
        })
        it('should work with only a function', () => {
            const justAType: ParserRecipe<Math> = makeSimpleParser(Math);
            const rawData = rawMathData();
            const parser = makeFromRecipe(justAType);
            const mathData = parser(rawData);
            checkBehavior(mathData);
        })
        it('should work with simple nested', () => {
            const rawData = rawMathData();
            const parser = makeFromRecipe(parserRecipe);
            const mathData = parser(rawData);
            checkBehavior(mathData);
        })
    })
});