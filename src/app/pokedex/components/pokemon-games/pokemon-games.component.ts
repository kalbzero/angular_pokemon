import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

@Component({
  selector: 'pokemon-games',
  imports: [],
  templateUrl: './pokemon-games.component.html',
  styleUrl: './pokemon-games.component.scss'
})
export class PokemonGamesComponent {
  @Input() pokemon: IPokemon | undefined;
}
