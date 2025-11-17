import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonType } from '../interfaces/IPokemonType';
import { IPokemonAbility } from '../interfaces/IPokemonAbility';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2/';

  public getPokemon(name: string): Observable<IPokemon> {
    return this.http
      .get<IPokemon>(`${this.baseUrl}pokemon/${name.toLowerCase()}`)
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
      `${this.baseUrl}type/${type.toLowerCase()}`
    );
  }

  public getPokemonSpecies(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}pokemon-species/${id}`);
  }

  public getAbility(name: string): Observable<IPokemonAbility> {
    return this.http.get<IPokemonAbility>(`${this.baseUrl}ability/${name.toLowerCase()}`);
  }

  public getPokemonMove(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}move/${name.toLowerCase()}`);
  }
}