
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