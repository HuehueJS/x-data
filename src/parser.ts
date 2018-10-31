import { Type, FunctionalParser, ParserRecipe, ObjectParserRecipe } from "./";

const isAnounymous = (obj: any) => {
    return obj.name == "";
}

class ObjectParser<E> {
    constructor(
        protected parser: FunctionalParser<E>,
        protected nestedParsers: { [name: string]: FunctionalParser<any> }
    ) {

    }

    parse(rawData: any): E {
        const parsedData = this.parser(rawData);
        Object.entries(this.nestedParsers).forEach(([k, v]) => {
            parsedData[k] = v(rawData[k]);
        })
        return parsedData;
    }

    asFunctionalParser() {
        return (it) => this.parse(it);
    }
}


export function makeSimpleParser<E>(type: Type<E>): FunctionalParser<E> {
    return (it) => {
        it.__proto__ = type.prototype;
        return it as E;
    }
}

export function makeFromObjectRecipe<E>(parserRecipe: ObjectParserRecipe<E>): FunctionalParser<E> {
    return new ObjectParser(
        makeFromRecipe(parserRecipe.target),
        Object.entries(parserRecipe.nestedTargets).map(([k, v]) => ([k, makeFromRecipe(v)]))
            .reduce((acc, [k, v]) => Object.assign(acc, { [k as string]: v }), {})
    ).asFunctionalParser()
}

export function makeFromRecipe<E>(parserRecipe: ParserRecipe<E>): FunctionalParser<E> {
    if (!isAnounymous(parserRecipe) && typeof parserRecipe == "function") {
        return makeSimpleParser(parserRecipe as Type<E>);
    }
    if (typeof parserRecipe == "function") {
        return parserRecipe as FunctionalParser<E>;
    }
    return makeFromObjectRecipe(parserRecipe);
}

export class XParser<E> {
    constructor(
        protected type: Type<E>
    ) {

    }

    mutate(rawData: any): E {
        rawData.__proto__ = this.type.prototype;
        return rawData as E;
    }

}