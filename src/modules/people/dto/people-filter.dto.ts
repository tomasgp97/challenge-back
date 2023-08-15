export interface PeopleNestedAttributes {
    species: boolean
    vehicles: boolean
    starships: boolean
    films: boolean
    homeworld: boolean  
}

export interface PeopleFilter extends Partial<PeopleNestedAttributes> {}

export interface PeoplePaginationFilter extends Partial<PeoplePaginationFilterReq> {
    
}

export interface PeoplePaginationFilterReq {
    peopleFilter: PeopleFilter
    limit: number
    offset: number
    totalRecords: number
}

