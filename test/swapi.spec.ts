import { makeFromRecipe, makeFromFunction } from "../src/parser";
import { expect } from "chai";
import { ParserRepositoryBuilder } from "../src/repository";
import { RepositoryRecipe, Parser, FunctionalParser } from "../src";



export class Planet {
    name: string//"Tatooine"
    rotationPeriod: number//"23"
    orbitalPeriod: number//"304"
    diameter: number//"10465"
    climate: string//"arid"
    gravity: string//"1 standard"
    terrain: string//"desert"
    surfaceWater: number//"1"
    population: number//"200000"
    residents: Array<string>
    films: Array<string>
    created: Date//"2014-12-09T13:50:49.641000Z"
    edited: Date//"2014-12-21T20:48:04.175778Z"
    url: string//"https://swapi.co/api/planets/1/"
}

const recipe: RepositoryRecipe = {
    stringToInt: makeFromFunction((it: string) => parseInt(it)),
    stringToDate: makeFromFunction((it: string) => new Date(it)),
    Planet: {
        type: Planet,
        $: {
            stringToDate: ['created', 'edited'],
            stringToInt: [
                'rotationPeriod',
                'orbitalPeriod',
                'diameter',
                'surfaceWater',
                'population',
            ]
        }
    }
}

const repositoryBuilder = new ParserRepositoryBuilder();
const repository = repositoryBuilder
    .addRecipe(recipe)
    .build();


const rawPlanet = {
    name: 'Tatooine',
    rotationPeriod: '23',
    orbitalPeriod: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surfaceWater: '1',
    population: '200000',
    residents: [
        'https://swapi.co/api/people/1/',
        'https://swapi.co/api/people/2/',
        'https://swapi.co/api/people/4/',
        'https://swapi.co/api/people/6/',
        'https://swapi.co/api/people/7/',
        'https://swapi.co/api/people/8/',
        'https://swapi.co/api/people/9/',
        'https://swapi.co/api/people/11/',
        'https://swapi.co/api/people/43/',
        'https://swapi.co/api/people/62/'
    ],
    films: [
        'https://swapi.co/api/films/5/',
        'https://swapi.co/api/films/4/',
        'https://swapi.co/api/films/6/',
        'https://swapi.co/api/films/3/',
        'https://swapi.co/api/films/1/'
    ],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-21T20:48:04.175778Z',
    url: 'https://swapi.co/api/planets/1/'
};


describe("Swapi", () => {
    it("Get Planet", () => {
        const planetParser = repository[Planet.name] as FunctionalParser<Planet>;
        const planet = planetParser(rawPlanet)
        expect(planet).to.instanceof(Planet)
        expect(typeof planet.name).to.equals("string")
        expect(typeof planet.population).to.equal("number")
        expect(planet.created).to.instanceof(Date)
    })
})