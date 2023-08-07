import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPokemonsList(limit: number = 60, offset: number = 60): Observable<Pokemon[]> { // limit=60&offset=60
    return this.http.get<Pokemon[]>(`${this.apiUrl}/pokemon/?limit=${limit}&offset=${offset}`);
  }
}
