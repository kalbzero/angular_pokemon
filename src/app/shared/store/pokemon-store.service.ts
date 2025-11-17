import { effect, inject, Injectable, signal } from '@angular/core';
import { PokemonService } from '../providers/pokemon.service';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonTypeRelations } from '../interfaces/IPokemonTypeRelations';
import { UtilsService } from '../services/utils.service';
import { firstValueFrom } from 'rxjs';
import { IPokemonAbility } from '../interfaces/IPokemonAbility';
import { IPokemonSpecies } from '../interfaces/IPokemonSpecies';

@Injectable({
  providedIn: 'root',
})
export class PokemonStore {
  #utilsService = inject(UtilsService);
  #pokemonService = inject(PokemonService);

  // Signals
  public loading = signal(false);
  public pokemon = signal<IPokemon | undefined>(undefined);
  public species = signal<IPokemonSpecies>({} as IPokemonSpecies);
  public abilities = signal<IPokemonAbility[]>([]);
  public typeData = signal<IPokemonTypeRelations>({} as IPokemonTypeRelations);
  public error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const poke = this.pokemon();
      if (!poke) return;

      // limpa habilidades antes de carregar
      this.abilities.set([]);

      poke.abilities.forEach((ab) => {
        this.#pokemonService.getAbility(ab.ability.name).subscribe((res: any) => {
          const en = res.effect_entries.find((e: any) => e.language.name === 'en');

          this.abilities.update((old) => [
            ...old,
            {
              name: ab.ability.name,
              is_hidden: ab.is_hidden,
              description: en?.effect ?? 'No description available.',
              ability: ab.ability,
              slot: ab.slot,
            }
          ]);
        });
      });
    });
  }
  
  // ============================================================
  // 1) Buscar Pokémon completo
  // ============================================================
  async fetchPokemon(name: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Nao se usa mais o toPromise, é "deprecated"
      // const poke = await this.pokemonService.getPokemon(name).toPromise();
      const poke = await firstValueFrom(this.#pokemonService.getPokemon(name));
      this.pokemon.set(poke);

      // pega os nomes dos tipos
      const types = poke!.types.map((t) => t.type.name);

      // busca informações de cada tipo e calcula fraquezas/resistências
      await this.fetchPokemonTypes(types);

      // Extrai ID do species.url
      const url = poke.species.url; // ex: ".../pokemon-species/10/"
      const id = url.split('/').filter(Boolean).pop();

      if (id) {
        this.loadSpecies(Number(id));
      }
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
  async fetchPokemonTypes(pokemonTypes: string[]): Promise<void> {
    try {
      const responses = await Promise.all(
        pokemonTypes.map((t) =>
          firstValueFrom(this.#pokemonService.getPokemonType(t))
        )
      );

      const result = this.#utilsService.calculateEffectiveness(responses);
      this.typeData.set(result);
    } catch (e) {
      console.error('Erro ao buscar tipos:', e);
      this.typeData.set({} as IPokemonTypeRelations);
    }
  }

  public getPokemonId(): number {
    return this.pokemon()!.id;
  }

  /** Carrega a species */
  private loadSpecies(id: number) {
    this.#pokemonService.getPokemonSpecies(id).subscribe((sp) => {
      this.species.set(sp);
    });
  }
}
