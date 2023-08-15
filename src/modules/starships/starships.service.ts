import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, catchError, concat, forkJoin, from, map, mergeMap, of, switchMap, toArray } from "rxjs";
import { Starship } from "./model/starships.model";
import { GenericService } from "../utils/utils.generic-service";
import { StarshipsFilter } from "./dto/starships-filter.dto";
import { Film } from "../films/model/films.model";
import { People } from "../people/model/people.model";

@Injectable()
export class StarshipsService extends GenericService<Starship> {

    
private readonly starshipsLogger = new Logger(StarshipsService.name)

 constructor(private configService: ConfigService, private readonly httpService: HttpService){
    super();
 }

 getAll(totalRecords: number): Observable<Starship[]> {
    const url = `${this.configService.get<string>('SW_API_URL')}/starships`

    const recordsPerPage = 10; // swapi has 10 default records per page

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return concat(
      ...pageNumbers.map(page =>
        this.httpService.get(`${url}?page=${page}`).pipe(
          map(response => response.data.results as Starship[])
        )
      )
    ).pipe(
      mergeMap(data => from(data)),
      toArray() 
    );
}

getOneWithFullInfo(id: number, optionalAttributes: StarshipsFilter): Observable<Starship> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/starships/${id}`;
  
    return this.httpService.get(url).pipe(
      switchMap(starship => {
        const filmObservables: Observable<Film>[] = optionalAttributes.films
          ? starship.data.films.map((filmUrl: string) =>
              this.httpService.get<Film>(filmUrl, { responseType: 'json' }).pipe(
                map(response => response.data)
              )
            )
          : [];
  
        const peopleObservables: Observable<People>[] = optionalAttributes.pilots
          ? starship.data.pilots.map((peopleUrl: string) =>
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
          return of(starship.data);
        }
  
        return forkJoin(observablesToCombine).pipe(
          map(results => {
            let resultIndex = 0;
            const combinedData: any = { ...starship.data };
            if (filmObservables.length > 0) {
              combinedData.films = results[resultIndex];
              resultIndex++;
            }
            if (peopleObservables.length > 0) {
              combinedData.people = results[resultIndex];
              resultIndex++;
            }
            return combinedData;
          })
        );
      }),
      catchError(error => {
        this.starshipsLogger.error(error);
        throw new Error(error);
      })
    );
  }

 getByPage(page: number):Observable<Starship[]> {
    const url = `${this.configService.get<string>('SW_API_URL')}/people/?page=${page}`
    
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.starshipsLogger.error(error)
            throw new Error(error)
        })
    )
}
    

getOne(id: number): Observable<Starship> {
    const url: string = `${this.configService.get<string>('SW_API_URL')}/starships/${id}`;
   
    return this.httpService.get(url).pipe(
        map(response => response.data),
        catchError(error => {
            this.starshipsLogger.error(error)
            throw new Error(error)
        })
    )
 }

 getByUrl(url: string): Observable<Starship> {
    return from(fetch(url)).pipe(
        switchMap(response => response.json())
      );
}

 getByUrls(urls: string[]): Observable<Starship[]> {
    const starshipObservables = urls.map(url =>
        from(fetch(url)).pipe(
          switchMap(response => response.json())
        )
      );
  
      return forkJoin(starshipObservables).pipe(
        map(starships => starships as Starship[]) 
      );
 }
}