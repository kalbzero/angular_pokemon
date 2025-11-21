import { Component, input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

@Component({
  selector: 'pokemon-header',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-header.component.html',
  styleUrls: ['./pokemon-header.component.scss']
})
export class PokemonHeaderComponent {
  pokemon = input<IPokemon | undefined>();
}
