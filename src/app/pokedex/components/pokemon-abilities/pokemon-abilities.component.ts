import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-abilities',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-abilities.component.html',
  styleUrl: './pokemon-abilities.component.scss'
})
export class PokemonAbilitiesComponent {
  @Input() pokemon: IPokemon | undefined;
}
