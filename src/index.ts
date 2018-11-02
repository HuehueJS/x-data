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
    target: Type<E>;
    nestedTargets?: { [fieldName: string]: ParserRecipe<any> | string };
}

export type ParserRecipe<E> = ObjectParserRecipe<E> | FunctionalParser<E>;

export interface RepositoryRecipe {
    [name: string]: ParserRecipe<any>;
}


/**
 * @todo common-lang
 */
export const isAnounymous = (obj: any) => {
    return obj.name == "";
}

const reduceToObject = (acc, [k, v]) => Object.assign(acc, { [k as string]: v });

const transformValue = it => ([k, v]) => ([k, it(v)]);

const setAtObject = obj => ([k, v]) => obj[k] = v;

export const Mappers = {
    Value: transformValue
}

export const Reducers = {
    Object: reduceToObject
}

export const Iter = {
    SetAt: setAtObject
}

/**
 * ------------
 */