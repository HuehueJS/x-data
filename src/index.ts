
export interface Type<T> extends Function {
    new(...args: any[]): T
}

export interface FunctionalParser<E> {
    (any): E;
}

export interface ParserRepository {
    [name: string]: FunctionalParser<any>;
}

export interface Parser<E> {
    mutate(rawData: any, parserRepository?: ParserRepository): E;
}

export interface ObjectParserRecipe<E> {
    target: Type<E> | FunctionalParser<E> | string;
    nestedTargets?: { [fieldName: string]: ParserRecipe<any> | string };
    reposiroty?: ParserRepository;
}

export type ParserRecipe<E> = ObjectParserRecipe<E> | Type<E> | FunctionalParser<E>;