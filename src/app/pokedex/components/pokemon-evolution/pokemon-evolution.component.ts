import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

@Component({
  selector: 'pokemon-evolution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-evolution.component.html',
  styleUrl: './pokemon-evolution.component.scss',
})
export class PokemonEvolutionComponent {
  #pokemonStore = inject(PokemonStore);

  // evolutionList = this.#pokemonStore.evolutionList;
  public evolutionTree = this.#pokemonStore.evolutionTree;
}
