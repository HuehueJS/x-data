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


/**
 * @todo common-lang
 */
export const isAnounymous = (obj: any) => {
    return obj.name == "";
}

const reduceToObject = (acc, [k, v]) => Object.assign(acc, { [k as string]: v });

const transformValue = it => ([k, v]) => ([k, it(v)]);

const setAtObject = obj => ([k, v]) => obj[k] = v;

const combine = ([k, v]) => v.map(it => [k, it]);

const swap = ([k, v]) => [v, k];

function flat<E>(acc: Array<E>, array: Array<E>): Array<E> {
    return acc.concat(array)
}

export const Mappers = {
    Value: transformValue,
    Combine: combine,
    Swap: swap
}

export const Reducers = {
    Object: reduceToObject,
    Flat: flat
}

export const Iter = {
    SetAt: setAtObject
}

/**
 * ------------
 */