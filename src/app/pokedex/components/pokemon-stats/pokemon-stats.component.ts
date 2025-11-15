import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-stats',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss'
})
export class PokemonStatsComponent {
  @Input() pokemon!: IPokemon;
}
