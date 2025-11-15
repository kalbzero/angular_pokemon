import { Component, Input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

@Component({
  selector: 'pokemon-types',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-types.component.html',
})
export class PokemonTypesComponent {
  @Input() pokemon!: IPokemon;
}