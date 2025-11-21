import { Component, computed, inject, input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { CommonModule } from '@angular/common';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { PokemonHeaderComponent } from '../pokemon-header/pokemon-header.component';
import { PokemonTypesComponent } from '../pokemon-types/pokemon-types.component';
import { PokemonAbilitiesComponent } from '../pokemon-abilities/pokemon-abilities.component';
import { PokemonTypesAnalysisComponent } from '../pokemon-types-analysis/pokemon-types-analysis.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
import { PokemonInfoComponent } from "../pokemon-info/pokemon-info.component";
import { PokemonMovesComponent } from "../pokemon-moves/pokemon-moves.component";
import { PokemonGamesComponent } from '../pokemon-games/pokemon-games.component';
import { PokemonEvolutionComponent } from "../pokemon-evolution/pokemon-evolution.component";

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    PokemonHeaderComponent,
    PokemonTypesComponent,
    PokemonAbilitiesComponent,
    PokemonTypesAnalysisComponent,
    PokemonStatsComponent,
    PokemonInfoComponent,
    PokemonMovesComponent,
    PokemonGamesComponent,
    PokemonEvolutionComponent
],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  pokemon = input<IPokemon | undefined>();
  pokemonStore = inject(PokemonStore);

  typeData = computed(() => this.pokemonStore.typeData());
  weaknesses = computed(() => this.typeData()?.weaknesses ?? []);
  resistances = computed(() => this.typeData()?.resistances ?? []);
  immunities = computed(() => this.typeData()?.immunities ?? []);
  effectivenessEntries = computed(() => {
    const eff = this.typeData()?.effectiveness ?? {};
    return Object.entries(eff); // Array<[string, number]>
  });
}
