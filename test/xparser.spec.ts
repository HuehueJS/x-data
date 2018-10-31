import { expect } from 'chai';
import { XParser, makeFunctionalParser } from '../src/parser';
import { ParserRecipe } from '../src/index';
import { makeSimpleParser } from '../src/parser';
import { makeFromRecipe } from '../src/parser';

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

const rawMathData = () => ({ a: 3, b: 5 });

const checkMathBehavior = (mathData: Math) => {
    expect(mathData.multiply()).to.equal(15);
}

const mathParserRecipe: ParserRecipe<Math> = {
    target: Math,
    nestedTargets: {
        a: (e) => e as number,
        b: (e) => e as number
    }
}


const asRational = (value: Rational | number): Rational => {
    if (value instanceof Rational) {
        return value;
    }
    return new Rational(value, value);
}

const asNumber = (value: Rational | number): number => {
    if (typeof value == "number") {
        return value;
    }
    return value.toNumber()
}

class Rational {
    constructor(
        public numerator: number | Rational,
        public denominator: number | Rational
    ) {

    }

    multiply(other): Rational {
        return new Rational(
            asRational(this.numerator).multiply(asRational(other.numerator)),
            asRational(this.denominator).multiply(other.denominator)
        )
    }

    toNumber(): number {
        return asNumber(this.numerator) / asNumber(this.denominator);
    }

}

const simpleRationalParser = makeSimpleParser(Rational);

const numberOrRationalParser = makeFunctionalParser((it) => typeof it == "number" ? it : simpleRationalParser(it));

const rationalParserRecipe: ParserRecipe<Rational> = {
    target: Rational,
    nestedTargets: {
        numerator: numberOrRationalParser,
        denominator: numberOrRationalParser
    }
}


describe('XParser', () => {

    const mathParser = new XParser(Math);

    describe('#mutate', () => {
        it('should mutate the data', () => {
            const rawData = rawMathData();
            const mathData = mathParser.mutate(rawData);
            checkMathBehavior(mathData);
        })
    })

    describe('#makeSimpleParser', () => {
        const simpleParser = makeSimpleParser(Math);
        it('should mutate the data', () => {
            const rawData = rawMathData();
            const mathData = simpleParser(rawData);
            checkMathBehavior(mathData);
        })
    })

    describe("#makeFromRecipe", () => {
        it('should work with only a type', () => {
            const justAType: ParserRecipe<Math> = Math;
            const rawData = rawMathData();
            const parser = makeFromRecipe(justAType);
            const mathData = parser(rawData);
            checkMathBehavior(mathData);
        })
        it('should work with only a function', () => {
            const justAType: ParserRecipe<Math> = makeSimpleParser(Math);
            const rawData = rawMathData();
            const parser = makeFromRecipe(justAType);
            const mathData = parser(rawData);
            checkMathBehavior(mathData);
        })
        it('should work with simple nested', () => {
            const rawData = rawMathData();
            const parser = makeFromRecipe(mathParserRecipe);
            const mathData = parser(rawData);
            checkMathBehavior(mathData);
        })


        const rationalParser = makeFromRecipe(rationalParserRecipe);

        it('should work with a complex type', () => {
            const rawData = {
                numerator: 10,
                denominator: 2
            };
            const rationalData = rationalParser(rawData);
            expect(rationalData.toNumber()).to.equals(5);
        })

        it('should work with a recursive complex type', () => {
            const rawData = {
                numerator: { numerator: 40, denominator: 4 },
                denominator: 2
            };
            const rationalData = rationalParser(rawData);
            expect(rationalData.toNumber()).to.equals(5);
        })

        it('should work with a very recursive complex type', () => {
            const rawData = {
                numerator: { numerator: 40, denominator: { numerator: 16, denominator: 4 } },
                denominator: 2
            };
            const rationalData = rationalParser(rawData);
            expect(rationalData.toNumber()).to.equals(5);
        })
    })
});