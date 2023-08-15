import { Observable } from "rxjs";

export abstract class GenericService<T> {
    abstract getByUrls(urls: string[]): Observable<T[]>;
    abstract getByUrl(url: string): Observable<T>; 
}