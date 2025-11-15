import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonType } from '../interfaces/IPokemonType';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  public getPokemon(name: string): Observable<IPokemon> {
    return this.http
      .get<IPokemon>(`${this.baseUrl}/${name.toLowerCase()}`)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            return throwError(() => new Error('not-found'));
          }
          return throwError(() => err);
        })
      );
  }

  public getPokemonType(type: string): Observable<IPokemonType> {
    return this.http.get<IPokemonType>(
      `https://pokeapi.co/api/v2/type/${type}`
    );
  }
}
