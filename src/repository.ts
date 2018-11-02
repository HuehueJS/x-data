import { FunctionalParser, Type } from "."
import { noop, getattr } from "@huehuejs/common-lang";


export interface ParserRepository {
    readonly [name: string]: FunctionalParser<any>;
}

export interface MutableParserRepository {
    [name: string]: FunctionalParser<any>;
}


export const mergeRepositories = (...repositories: Array<ParserRepository>): ParserRepository => {
    const mergedRepositoriesProxyHandler: ProxyHandler<Array<ParserRepository>> = {
        get: (_: any, field: string) => {
            return getattr(repositories.find(it => field in it), field, noop);
        }
    };
    return new Proxy({}, mergedRepositoriesProxyHandler) as ParserRepository;
}

const selfFeederRepositoryProxyHandler: ProxyHandler<ParserRepository> = {
    get: (target: ParserRepository, field: string) => {
        const parser = target[field];
        return (it: any, repository: ParserRepository) => {
            return parser(it, mergeRepositories(repository || {}, target));
        }
    }
}

export const asSelfFeederRepostiory = (repository: ParserRepository): ParserRepository => {
    return new Proxy(repository, selfFeederRepositoryProxyHandler);
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
        return asSelfFeederRepostiory(this.repository);
    }

}