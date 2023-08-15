import { PeopleDto } from "src/modules/people/dto/people.dto"
import { PlanetDto } from "src/modules/planets/dto/planets.dto"
import { StarshipDto } from "src/modules/starships/dto/starships.dto"

export class FilmDto {
    title: string 
    episode_id: number
    opening_crawl: string 
    director: string 
    producer: string 
    release_date: Date 
    species?: any[] 
    starships: StarshipDto[]
    vehicles?: any[]  
    characters: PeopleDto[]  
    planets: PlanetDto[] 
    url: string 
    created: string 
    edited: string 
    }

export interface PartialFilmDto extends Partial<FilmDto> {}
