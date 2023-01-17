import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, of, map, tap } from 'rxjs';
import { Hero } from './hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService implements OnInit {
  private heroesUrl = 'api/heroes'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log(this.getHeroes.length);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => console.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // get hero by id. will 404 if id not found.
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => console.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

    /** PUT : update the hero on the server**/
    updateHero(hero : Hero) : Observable<any> {
     return this.http.put(this.heroesUrl, hero, this.httpOptions)
     .pipe(
       tap(_=> console.log(`updated hero id =${hero.id}`)),
       catchError(this.handleError<any>('updateHero'))
     );
    }

    /**POST : add a new hero to the server */
    addHero(hero: Hero): Observable<Hero>{
      return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero:Hero) => console.log(`added hero with id = ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
    }

    /***DELETE : delete the hero on the server */
    deleteHero(id:number) : Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`deleted hero wich id = ${id}`)),
        catchError(this.handleError<Hero>('deletedHero'))
      );
    }

    /**Get heroes whose name contains search term  */
    searchHeroes(term: string) : Observable<Hero[]>{
      if(!term.trim()){
        // if not search term, return empty hero to array.
        return of([]);
      }
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(t => t.length ? 
             console.log(`found heroes matching "${term}"`) :
             console.log(`no heroes matching "${term}"`)),
             catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
