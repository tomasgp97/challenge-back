import { Film } from "src/modules/films/model/films.model"
import { People } from "src/modules/people/model/people.model"

export class Planet {
name: string 
diameter: string 
rotation_period: string
orbital_period: string 
gravity: string 
population: string 
climate: string 
terrain: string
surface_water: string 
residents: People[]
films: Film[] 
url: string 
created: string 
edited: string 
}
