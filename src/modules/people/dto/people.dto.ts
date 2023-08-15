import { People } from "../model/people.model"

export class PeopleDto {
    name: string
    birth_year: string
    eye_color: string
    gender: string
    hair_color: string
    height: string
    mass: string
    skin_color: string
    homeworld: string
    films: any[]
    species?: any[]
    starships: any[]
    vehicles?: any[]
    url: string
    created: string
    edited: string

    public static fromPeople(people: People): PeopleDto {
        const peopleDto = new PeopleDto();
        peopleDto.name = people.name;
        peopleDto.birth_year = people.birth_year;
        peopleDto.eye_color = people.eye_color;
        peopleDto.gender = people.gender;
        peopleDto.hair_color = people.hair_color;
        peopleDto.height = people.height;
        peopleDto.mass = people.mass;
        peopleDto.skin_color = people.skin_color;
        peopleDto.homeworld = people.homeworld;
        peopleDto.url = people.url;
        peopleDto.created = people.created;
        peopleDto.edited = people.edited;
        return peopleDto;

    }
} 

export interface PartialPeopleDto extends Partial<PeopleDto> {}
