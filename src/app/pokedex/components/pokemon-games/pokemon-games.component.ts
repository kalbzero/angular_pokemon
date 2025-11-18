import { Component, input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-games',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-games.component.html',
  styleUrl: './pokemon-games.component.scss'
})
export class PokemonGamesComponent {
  pokemon = input<IPokemon | undefined>();
}
