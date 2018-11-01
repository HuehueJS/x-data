import { FunctionalParser } from "."

export interface ParserRepository {
    readonly [name: string]: FunctionalParser<any>;
}


export interface MutableParserRepository {
    [name: string]: FunctionalParser<any>;
}


export class ParserRepositoryBuilder {
    constructor(
        protected repository: MutableParserRepository = {}
    ) {

    }

    add(name: string, parser: FunctionalParser<any>): ParserRepositoryBuilder {
        this.repository[name] = parser;
        return this;
    }

    build(): ParserRepository {
        return this.repository;
    }

}