import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

@Component({
  selector: 'pokemon-info',
  imports: [],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.scss'
})
export class PokemonInfoComponent {
  @Input() pokemon: IPokemon | undefined;
}
