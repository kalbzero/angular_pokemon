import { Component, computed, inject } from '@angular/core';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-types-analysis',
  imports: [TitleCasePipe, KeyValuePipe],
  templateUrl: './pokemon-types-analysis.component.html',
  styleUrl: './pokemon-types-analysis.component.scss',
})
export class PokemonTypesAnalysisComponent {
  pokemonStore = inject(PokemonStore);

  typeData = computed(() => this.pokemonStore.typeData());
  weaknesses = computed(() => this.typeData()?.weaknesses ?? []);
  resistances = computed(() => this.typeData()?.resistances ?? []);
  immunities = computed(() => this.typeData()?.immunities ?? []);
  effectiveness = computed(() => this.typeData()?.effectiveness ?? {});
}
