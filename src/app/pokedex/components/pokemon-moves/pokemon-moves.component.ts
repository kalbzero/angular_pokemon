import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-moves',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-moves.component.html',
  styleUrl: './pokemon-moves.component.scss'
})
export class PokemonMovesComponent {
  @Input() pokemon!: IPokemon;
}
