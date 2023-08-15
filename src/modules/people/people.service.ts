import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, concat, forkJoin, from, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { People } from './model/people.model';
import { PeopleFilter } from './dto/people-filter.dto';
import { FilmsService } from '../films/films.service';
import { StarshipsService } from '../starships/starships.service';
import { PlanetsService } from '../planets/planets.service';
import { GenericService } from '../utils/utils.generic-service';
import { Film } from '../films/model/films.model';
import { Starship } from '../starships/model/starships.model';
import { Planet } from '../planets/model/planets.model';

@Injectable()
export class PeopleService extends GenericService<People> {

   
private readonly peopleLogger = new Logger(PeopleService.name)

 constructor(private configService: ConfigService, 
    private readonly httpService: HttpService,
   ){
        super();
    }


getByUrls(urls: string[]): Observable<People[]> {
    const peopleObservables = urls.map(url =>
        from(fetch(url)).pipe(
            switchMap(response => response.json())
        )
        );
    
        return forkJoin(peopleObservables).pipe(
        map(people => people as People[]) 
        );
}

getByUrl(url: string): Observable<People> {
    return from(fetch(url)).pipe(
        switchMap(response => response.json())
        );
}

getByPage(page: number):Observable<People[]> {
    const url = `${this.configService.get<string>('SW_API_URL')}/people/?page=${page}`
    
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.peopleLogger.error(error)
            throw new Error(error)
        })
    )
}
 

getAll(totalRecords: number): Observable<People[]> {
    const url = `${this.configService.get<string>('SW_API_URL')}/people/`

    const recordsPerPage = 10; // swapi has 10 default records per page

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return concat(
      ...pageNumbers.map(page =>
        this.httpService.get(`${url}?page=${page}`).pipe(
          map(response => response.data.results as People[])
        )
      )
    ).pipe(
      mergeMap(data => from(data)),
      toArray() 
    );
  }

  getOne(id: number): Observable<People> {
    const url = `${this.configService.get<string>('SW_API_URL')}/people/${id}`
    
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.peopleLogger.error(error)
            throw new Error(error)
        })
    )
  }

   

getOneWithFullInfo(id: number, optionalAttributes: PeopleFilter): Observable<People> {
    
    const url: string = `${this.configService.get<string>('SW_API_URL')}/people/${id}`;
        
    return this.httpService.get(url).pipe(
        switchMap(person => {
        const filmObservables: Observable<Film[]>[] = optionalAttributes.films
            ? person.data.films.map((filmUrl: string) =>
                this.httpService.get<Film[]>(filmUrl, { responseType: 'json' }).pipe(
                    map(response => response.data)
                )
            )
            : [];
    
        const starshipObservables: Observable<Starship[]>[] = optionalAttributes.starships
            ? person.data.starships.map((starshipUrl: string) =>
                this.httpService.get<Starship[]>(starshipUrl, { responseType: 'json' }).pipe(
                    map(response => response.data)
                )
            )
            : [];
    
        const homeworldObservable: Observable<Planet | null> = optionalAttributes.homeworld
            ? this.httpService.get<Planet>(person.data.homeworld, { responseType: 'json' }).pipe(
                map(response => response.data)
            )
            : of(null);
    
        const observablesToCombine: Observable<any>[] = [];
        if (filmObservables.length > 0) {
            observablesToCombine.push(forkJoin(filmObservables));
        }
        if (starshipObservables.length > 0) {
            observablesToCombine.push(forkJoin(starshipObservables));
        }
        if (homeworldObservable) {
            observablesToCombine.push(homeworldObservable);
          }
    
        if (observablesToCombine.length === 0) {
            return of(person.data);
        }
    
        return forkJoin(observablesToCombine).pipe(
            map(results => {
            let resultIndex = 0;
            const combinedData: any = { ...person.data };
            if (filmObservables.length > 0) {
                combinedData.films = results[resultIndex];
                resultIndex++;
            }
            if (starshipObservables.length > 0) {
                combinedData.starships = results[resultIndex];
                resultIndex++;
            }
            if (homeworldObservable) {
                combinedData.homeworld = results[resultIndex];
              }
            return combinedData;
            })
        );
        }),
        catchError(error => {
        this.peopleLogger.error(error);
        throw new Error(error);
        })
    );
      }
  }
