export interface FilmNestedAttributes {
    // species: boolean
    // vehicles: boolean
    starships: boolean
    people: boolean
    planets: boolean  
}

export interface FilmsFilter extends Partial<FilmNestedAttributes> {}