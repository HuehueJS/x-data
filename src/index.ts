import { ParserRepository } from "./repository";

export interface Type<T> extends Function {
    new(...args: any[]): T
}

export interface FunctionalParser<E> {
    (any, ParserRepository?): E;
}


export interface Parser<E> {
    mutate(rawData: any, parserRepository?: ParserRepository): E;
}

export interface ObjectParserRecipe<E> {
    target: Type<E> | FunctionalParser<E> | string;
    nestedTargets?: { [fieldName: string]: ParserRecipe<any> | string };
}

export type ParserRecipe<E> = ObjectParserRecipe<E> | Type<E> | FunctionalParser<E>;