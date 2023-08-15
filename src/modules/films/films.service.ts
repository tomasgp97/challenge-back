import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import { Film } from './model/films.model';
import { GenericService } from '../utils/utils.generic-service';
import { FilmsFilter } from './dto/films-filter.dto';
import { PeopleService } from '../people/people.service';
import { PlanetsService } from '../planets/planets.service';
import { StarshipsService } from '../starships/starships.service';
import { People } from '../people/model/people.model';
import { Starship } from '../starships/model/starships.model';
import { Planet } from '../planets/model/planets.model';

@Injectable()
export class FilmsService extends GenericService<Film> {
    
private readonly filmLogger = new Logger(FilmsService.name)

 constructor(private configService: ConfigService, 
    private readonly httpService: HttpService,
  ){
    super();
 }


 getAll(): Observable<Film[]> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/films`;

    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.filmLogger.error(error)
            throw new Error(error)
        })
    )
  }

  getOneWithFullInfo(id: number, optionalAttributes: FilmsFilter): Observable<Film> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/films/${id}`;
     
    return this.httpService.get(url).pipe(
      switchMap(film => {
        const peopleObservables: Observable<People>[] = optionalAttributes.people
          ? film.data.characters.map((peopleUrl: string) =>
              this.httpService.get<People>(peopleUrl, { responseType: 'json' }).pipe(
                  map(response => response.data)
              )
            )
          : [];
    
        const starshipObservables: Observable<Starship>[] = optionalAttributes.starships
          ? film.data.starships.map((starshipUrl: string) =>
              this.httpService.get<Starship>(starshipUrl, { responseType: 'json' }).pipe(
                  map(response => response.data)
              )
            )
          : [];
  
        const planetsObservables: Observable<Planet>[] = optionalAttributes.planets
          ? film.data.planets.map((planetUrl: string) =>
              this.httpService.get<Planet>(planetUrl, { responseType: 'json' }).pipe(
                  map(response => response.data)
              )
            )
          : [];
    
        const observablesToCombine: Observable<any>[] = [];
        if (peopleObservables.length > 0) {
          observablesToCombine.push(forkJoin(peopleObservables));
        }
        if (starshipObservables.length > 0) {
          observablesToCombine.push(forkJoin(starshipObservables));
        }
        if (planetsObservables.length > 0) {
          observablesToCombine.push(forkJoin(planetsObservables));
        }
    
        if (observablesToCombine.length === 0) {
          return of(film.data);
        }
    
        return forkJoin(observablesToCombine).pipe(
          map(results => {
            let resultIndex = 0;
            const combinedData: any = { ...film.data };
            if (peopleObservables.length > 0) {
              combinedData.characters = results[resultIndex];
              resultIndex++;
            }
            if (starshipObservables.length > 0) {
              combinedData.starships = results[resultIndex];
              resultIndex++;
            }
            if (planetsObservables.length > 0) {
              combinedData.planets = results[resultIndex];
            }
            return combinedData;
          })
        );
      }),
      catchError(error => {
        this.filmLogger.error(error);
        throw new Error(error);
      })
    );
  }
 

getOne(id: number): Observable<Film> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/films/${id}`;
   

    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.filmLogger.error(error)
            throw new Error(error)
        })
    )
 }

 getByUrl(url: string): Observable<Film> {
    return from(fetch(url)).pipe(
        switchMap(response => response.json())
      );
}

 getByUrls(urls: string[]): Observable<Film[]> {
    const filmsObservables = urls.map(url =>
        from(fetch(url)).pipe(
          switchMap(response => response.json())
        )
      );
  
      return forkJoin(filmsObservables).pipe(
        map(films => films as Film[]) 
      );
 }
 }
