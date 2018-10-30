
export interface Type<T> extends Function {
    new (...args: any[]): T
}

export interface Parser<E> {
    mutate(rawData: any): E;
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

export interface ObjectParserSpec<E> {
    target: Type<E>;
    nestedTargets: { [fieldName: string]: ParserSpec<any> };
    multiple: boolean;
}

export interface FunctionalParser<E> {
    (any): E;
}


export type ParserSpec<E> = ObjectParserSpec<E> | Type<E> | FunctionalParser<E>;