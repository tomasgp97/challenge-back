import { FilmDto } from "src/modules/films/dto/films.dto"
import { PeopleDto } from "src/modules/people/dto/people.dto"

export class PlanetDto {
    name: string 
    diameter: string 
    rotation_period: string
    orbital_period: string 
    gravity: string 
    population: string 
    climate: string 
    terrain: string
    surface_water: string 
    residents: PeopleDto[]
    films: FilmDto[] 
    url: string 
    created: string 
    edited: string 
    }
    
export interface PartialPlanetDto extends Partial<PlanetDto> {}
