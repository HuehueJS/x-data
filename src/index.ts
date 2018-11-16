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
    type: Type<E>;
    fields?: { [fieldName: string]: ParserRecipe<any> | string };
    $?: { [parserName: string]: Array<string> }
}

export type ParserRecipe<E> = ObjectParserRecipe<E> | FunctionalParser<E>;

export interface RepositoryRecipe {
    [name: string]: ParserRecipe<any>;
}