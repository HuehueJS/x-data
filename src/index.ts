
export interface Type<T> extends Function {
    new (...args: any[]): T
}

export interface Parser<E> {
    mutate(rawData: any): E;
}


export interface FunctionalParser<E> {
    (any): E;
}

export interface ObjectParserRecipe<E> {
    target: Type<E> | FunctionalParser<E>;
    nestedTargets: { [fieldName: string]: ParserRecipe<any> };
}

export type ParserRecipe<E> = ObjectParserRecipe<E> | Type<E> | FunctionalParser<E>;