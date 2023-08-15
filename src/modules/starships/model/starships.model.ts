import { Film } from "src/modules/films/model/films.model"
import { People } from "src/modules/people/model/people.model"
import { StarshipDto } from "../dto/starships.dto"

export class Starship {
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
films: Film[] 
pilots: People[]
url: string 
created: string
edited: string 
}

export interface PartialStarshipDto extends Partial<StarshipDto> {}
