import { Type, FunctionalParser, ParserRecipe, ObjectParserRecipe, Parser } from "./";
import { ParserRepository } from "./repository";
import { noop, getattr } from "@huehuejs/common-lang";

/**
 * @todo common-lang
 */
const isAnounymous = (obj: any) => {
    return obj.name == "";
}

const reduceToObject = (acc, [k, v]) => Object.assign(acc, { [k as string]: v });

const transformValue = it => ([k, v]) => ([k, it(v)]);

const Mappers = {
    Value: transformValue
}

const Reducers = {
    Object: reduceToObject
}

/**
 * ------------
 */

class RefParser implements Parser<any>{

    constructor(
        protected name: string
    ) {

    }

    mutate(rawData: any, repository?: ParserRepository) {
        return getattr(repository, this.name, noop)(rawData, repository);
    }

    asFunctionalParser() {
        return (it, repository?: ParserRepository) => this.mutate(it, repository);
    }
}

class ObjectParser<E> implements Parser<E> {
    constructor(
        protected parser: FunctionalParser<E>,
        protected nestedParsers: { [name: string]: FunctionalParser<any> }
    ) {

    }

    mutate(rawData: any, repository?: ParserRepository): E {
        const parsedData = this.parser(rawData, repository);
        Object.entries(this.nestedParsers).forEach(([k, v]) => {
            parsedData[k] = v(rawData[k], repository);
        })
        return parsedData;
    }

    asFunctionalParser() {
        return (it, repository?: ParserRepository) => this.mutate(it, repository);
    }
}


export function toArray<E>(parser: FunctionalParser<E>): FunctionalParser<Array<E>> {
    return (any: Array<any>, repository: ParserRepository) => any.map(it => parser(it, repository));
}

export function makeFromType<E>(type: Type<E>): FunctionalParser<E> {
    return (it) => {
        it.__proto__ = type.prototype;
        return it as E;
    }
}


export function makeFromFunction<E>(func: (_: any, repository?: ParserRepository) => E): FunctionalParser<E> {
    return (it: any, repository?: ParserRepository) => {
        return func(it, repository);
    }
}

export function makeFromString(name: string): FunctionalParser<any> {
    return new RefParser(name).asFunctionalParser();
}

export function makeFromObjectRecipe<E>(parserRecipe: ObjectParserRecipe<E>): FunctionalParser<E> {
    return new ObjectParser(
        makeFromRecipe(parserRecipe.target),
        Object.entries(parserRecipe.nestedTargets)
            .map(Mappers.Value(makeFromRecipe))
            .reduce(Reducers.Object, {})
    ).asFunctionalParser()
}

export function makeFromRecipe<E>(parserRecipe: ParserRecipe<E> | string): FunctionalParser<E> {
    if (!isAnounymous(parserRecipe) && typeof parserRecipe == "function") {
        return makeFromType(parserRecipe as Type<E>);
    }
    if (typeof parserRecipe == "function") {
        return parserRecipe as FunctionalParser<E>;
    }
    if (typeof parserRecipe == "string") {
        return makeFromString(parserRecipe);
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