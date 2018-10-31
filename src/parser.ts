import { Type, FunctionalParser, ParserRecipe } from "./";

export function makeSimpleParser<E>(type: Type<E>): FunctionalParser<E> {
    return (it) => {
        it.__proto__ = type.prototype;
        return it as E;
    }
}

export function makeFromRecipe<E>(parserRecipe: ParserRecipe<E>): FunctionalParser<E> {
    console.log(parserRecipe, typeof parserRecipe);
    if ('prototype' in parserRecipe) {
        return makeSimpleParser(parserRecipe as Type<E>);
    }
    if (typeof parserRecipe === "function") {
        return parserRecipe as FunctionalParser<E>;
    }
    return (it) => it as E;
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