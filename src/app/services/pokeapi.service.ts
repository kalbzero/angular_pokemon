import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonList } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param limit number of pokemons in array, default is 20, getting 20 pokemons from 'offset'.
   * @param offset From pokemon number X onwards, default is 0, so get 'bulbasaur' #1 until 'raticate' #20.
   * @returns List of 'limit' pokemons from 'offset'.
   */
  getPokemonsList(limit: number = 20, offset: number = 0): Observable<PokemonList> {
    return this.http.get<PokemonList>(`${this.apiUrl}/pokemon/?limit=${limit}&offset=${offset}`);
  }

  /**
   * 
   * @param id id or name of the pokemon
   * @returns a object with pokemon's data
   */
  getPokemonByID(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${id}/`);
  }
}
