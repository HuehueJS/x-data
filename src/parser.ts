import { Type, FunctionalParser, ParserRecipe, ObjectParserRecipe, Parser } from "./";
import { ParserRepository } from "./repository";
import { noop, getattr } from "@huehuejs/common-lang";
import { Mappers, Reducers } from "@huehuejs/common-lang/array"

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
    const fieldsParsers =
        Object.entries(parserRecipe.fields || {})
            .map(Mappers.Value(makeFromRecipe))
            .reduce(Reducers.Object, {})
    const $Parsers =
        Object.entries(parserRecipe.$ || {})
            .map(Mappers.Combine)
            .reduce(Reducers.Flat, [])
            .map(Mappers.Swap)
            .map(Mappers.Value(makeFromString))
            .reduce(Reducers.Object, {})
    return new ObjectParser(
        makeFromType(parserRecipe.type),
        { ...fieldsParsers, ...$Parsers }
    ).asFunctionalParser()
}

export function makeFromRecipe<E>(parserRecipe: ParserRecipe<E> | string): FunctionalParser<E> {
    if (typeof parserRecipe == "function") {
        return parserRecipe as FunctionalParser<E>;
    }
    if (typeof parserRecipe == "string") {
        return makeFromString(parserRecipe);
    }
    return makeFromObjectRecipe(parserRecipe);
}