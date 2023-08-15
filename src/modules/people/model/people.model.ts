import { Film } from "src/modules/films/model/films.model"
import { Starship } from "src/modules/starships/model/starships.model"

export class People {
    name: string
    birth_year: string
    eye_color: string
    gender: string
    hair_color: string
    height: string
    mass: string
    skin_color: string
    homeworld: string
    films: Film[]
    species?: any[]
    starships: Starship[]
    vehicles?: any[]
    url: string
    created: string
    edited: string
}