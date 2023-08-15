export interface PlanetsFilter extends Partial<PlanetsNestedAttributes>{}

export interface PlanetsNestedAttributes {
    residents: boolean
    films: boolean
}