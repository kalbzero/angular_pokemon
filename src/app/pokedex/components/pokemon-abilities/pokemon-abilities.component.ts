import { Component, inject, Input} from '@angular/core';
import {
  IPokemon,
} from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

@Component({
  selector: 'pokemon-abilities',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-abilities.component.html',
  styleUrl: './pokemon-abilities.component.scss',
})
export class PokemonAbilitiesComponent {
  @Input() pokemon: IPokemon | undefined;

  #pokemonStore = inject(PokemonStore);

  public abilities = this.#pokemonStore.abilities;
  
}
