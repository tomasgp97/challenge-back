import { FilmDto } from "src/modules/films/dto/films.dto"
import { PeopleDto } from "src/modules/people/dto/people.dto"

export class StarshipDto {
    name: string 
    model: string 
    starship_class: string 
    manufacturer: string 
    cost_in_credits: string
    length: string 
    crew: string 
    passengers: string 
    max_atmosphering_speed: string
    hyperdrive_rating: string 
    MGLT: string 
    cargo_capacity: string 
    consumables: string
    films: FilmDto[] 
    pilots: PeopleDto[]
    url: string 
    created: string
    edited: string 
    }