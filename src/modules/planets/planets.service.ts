import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, concat, forkJoin, from, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { Planet } from './model/planets.model';
import { GenericService } from '../utils/utils.generic-service';
import { PlanetsFilter } from './dto/planets-filter.dto';
import { People } from '../people/model/people.model';
import { Film } from '../films/model/films.model';

@Injectable()
export class PlanetsService extends GenericService<Planet> {
private readonly planetLogger = new Logger(PlanetsService.name)

 constructor(private configService: ConfigService, private readonly httpService: HttpService){
    super();
 }

 getByPage(page: number):Observable<Planet[]> {
    const url = `${this.configService.get<string>('SW_API_URL')}/people/?page=${page}`
    
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.planetLogger.error(error)
            throw new Error(error)
        })
    )
}
    

getOne(id: number): Observable<Planet> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/planets/${id}`;
   
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.planetLogger.error(error)
            throw new Error(error)
        })
    )
 }

 getByUrl(url: string): Observable<Planet> {
    return from(fetch(url)).pipe(
      switchMap(response => response.json())
    );
  }

 getByUrls(urls: string[]): Observable<Planet[]> {
    const planetsObservables = urls.map(url =>
        from(fetch(url)).pipe(
          switchMap(response => response.json())
        )
      );
  
      return forkJoin(planetsObservables).pipe(
        map(planets => planets as Planet[]) 
      );
 }

 getAll(totalRecords: number): Observable<Planet[]>{
    const url = `${this.configService.get<string>('SW_API_URL')}/planets`

    const recordsPerPage = 10; // swapi has 10 default records per page

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return concat(
      ...pageNumbers.map(page =>
        this.httpService.get(`${url}?page=${page}`).pipe(
          map(response => response.data.results as Planet[])
        )
      )
    ).pipe(
      mergeMap(data => from(data)),
      toArray() 
    );
 }

 getOneWithFullInfo(id: number, optionalAttributes: PlanetsFilter): Observable<Planet> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/planets/${id}`;
  
    return this.httpService.get(url).pipe(
      switchMap(planet => {
        const filmObservables: Observable<Film>[] = optionalAttributes.films
          ? planet.data.films.map((filmUrl: string) =>
              this.httpService.get<Film>(filmUrl, { responseType: 'json' }).pipe(
                map(response => response.data)
              )
            )
          : [];
  
        const peopleObservables: Observable<People>[] = optionalAttributes.residents
          ? planet.data.residents.map((peopleUrl: string) =>
              this.httpService.get<People>(peopleUrl, { responseType: 'json' }).pipe(
                map(response => response.data)
              )
            )
          : [];
  
        const observablesToCombine: Observable<any>[] = [];
        if (filmObservables.length > 0) {
          observablesToCombine.push(forkJoin(filmObservables));
        }
        if (peopleObservables.length > 0) {
          observablesToCombine.push(forkJoin(peopleObservables));
        }
  
        if (observablesToCombine.length === 0) {
          return of(planet.data);
        }
  
        return forkJoin(observablesToCombine).pipe(
          map(results => {
            let resultIndex = 0;
            const combinedData: any = { ...planet.data };
            if (filmObservables.length > 0) {
              combinedData.films = results[resultIndex];
              resultIndex++;
            }
            if (peopleObservables.length > 0) {
              combinedData.residents = results[resultIndex];
              resultIndex++;
            }
            return combinedData;
          })
        );
      }),
      catchError(error => {
        this.planetLogger.error(error);
        throw new Error(error);
      })
    );
  }
 
}
