import { People } from "src/modules/people/model/people.model"
import { Planet } from "src/modules/planets/model/planets.model"
import { Starship } from "src/modules/starships/model/starships.model"

export class Film {
title: string 
episode_id: number
opening_crawl: string 
director: string 
producer: string 
release_date: Date 
species?: any[] 
starships: Starship[]
vehicles?: any[]  
characters: People[]  
planets: Planet[] 
url: string 
created: string 
edited: string 
}