import { inject, Injectable, signal } from '@angular/core';
import { PokemonService } from '../providers/pokemon.service';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonTypeRelations } from '../interfaces/IPokemonTypeRelations';
import { UtilsService } from '../services/utils.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonStore {
  private utils = inject(UtilsService);
  private pokemonService = inject(PokemonService);

  // Signals
  loading = signal(false);
  pokemon = signal<IPokemon | undefined>(undefined);
  typeData = signal<IPokemonTypeRelations>({} as IPokemonTypeRelations);
  error = signal<string | null>(null);

  // ============================================================
  // 1) Buscar Pokémon completo
  // ============================================================
  async fetchPokemon(name: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Nao se usa mais o toPromise, é "deprecated"
      // const poke = await this.pokemonService.getPokemon(name).toPromise();
      const poke = await firstValueFrom(this.pokemonService.getPokemon(name));
      this.pokemon.set(poke);

      // pega os nomes dos tipos
      const types = poke!.types.map((t) => t.type.name);

      // busca informações de cada tipo e calcula fraquezas/resistências
      await this.fetchPokemonTypes(types);
    } catch (e: any) {
      if (e?.status === 404) {
        this.error.set('Pokémon não encontrado.');
      } else {
        this.error.set('Erro ao buscar dados.');
      }
      this.pokemon.set(undefined);
      this.typeData.set({} as IPokemonTypeRelations);
    } finally {
      this.loading.set(false);
    }
  }

  // ============================================================
  // 2) Buscar os tipos (1 ou 2) do Pokémon e combinar danos
  // ============================================================
  async fetchPokemonTypes(pokemonTypes: string[]) {
    try {
      const responses = await Promise.all(
        pokemonTypes.map((t) =>
          firstValueFrom(this.pokemonService.getPokemonType(t))
        )
      );

      const result = this.utils.calculateEffectiveness(responses);
      this.typeData.set(result);
    } catch (e) {
      console.error('Erro ao buscar tipos:', e);
      this.typeData.set({} as IPokemonTypeRelations);
    }
  }
}
