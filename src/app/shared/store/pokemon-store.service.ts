import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { PokemonService } from '../providers/pokemon.service';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonTypeRelations } from '../interfaces/IPokemonTypeRelations';
import { UtilsService } from '../services/utils.service';
import { firstValueFrom } from 'rxjs';
import { IPokemonAbility } from '../interfaces/IPokemonAbility';
import { IPokemonSpecies } from '../interfaces/IPokemonSpecies';
import {
  EvolutionNode,
  IPokemonEvolutionChain,
} from '../interfaces/IPokemonEvolutionChain';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonStore {
  #utilsService = inject(UtilsService);
  #pokemonService = inject(PokemonService);
  #toastService = inject(ToastService);

  // Signals
  public loading = signal(false);
  public pokemon = signal<IPokemon | undefined>(undefined);
  public species = signal<IPokemonSpecies>({} as IPokemonSpecies);
  public abilities = signal<IPokemonAbility[]>([]);
  public evolutionChain = signal<IPokemonEvolutionChain>(
    {} as IPokemonEvolutionChain
  );
  public evolutionList = computed(() => {
    const chain = this.evolutionChain();

    if (!chain?.chain) return [];

    const evolutions: { name: string; id: number; image: string }[] = [];
    let current = chain.chain;

    while (current) {
      const speciesUrl = current.species.url;
      const id = Number(speciesUrl.split('/').filter(Boolean).pop());

      evolutions.push({
        name: current.species.name,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      });

      current = current.evolves_to?.[0];
    }

    return evolutions;
  });
  public evolutionTree = computed(() => {
    const evo = this.evolutionChain();

    if (!evo?.chain) return null;

    return this.buildEvolutionTree(evo.chain);
  });
  public typeData = signal<IPokemonTypeRelations>({} as IPokemonTypeRelations);

  constructor() {
    effect(() => {
      const poke = this.pokemon();
      this.abilities.set([]);
      if (!poke) return;
      poke.abilities.forEach((ab) => {
        this.#pokemonService
          .getAbility(ab.ability.name)
          .subscribe((res: any) => {
            const en = res.effect_entries.find(
              (e: any) => e.language.name === 'en'
            );
            this.abilities.update((old) => [
              ...old,
              {
                name: ab.ability.name,
                is_hidden: ab.is_hidden,
                description: en?.effect ?? 'No description available.',
                ability: ab.ability,
                slot: ab.slot,
              },
            ]);
          });
      });
    });
  }

  async fetchPokemon(name: string): Promise<void> {
    this.loading.set(true);

    try {
      const poke = await firstValueFrom(this.#pokemonService.getPokemon(name));
      this.pokemon.set(poke);

      const types = poke!.types.map((t) => t.type.name);

      await this.fetchPokemonTypes(types);

      const url = poke.species.url; // ex: ".../pokemon-species/10/"
      const id = url.split('/').filter(Boolean).pop();

      if (id) {
        this.loadSpecies(Number(id));
      }
    } catch (e: any) {
      const is404 = e?.status === 404 || e?.message === 'not-found';

      if (is404) {
        this.#toastService.show(`The Pokémon '${name}' does not exist.`, 'error');
      } else {
        this.#toastService.show('Pokémon not founded.', 'error');
      }
      this.pokemon.set(undefined);
      this.typeData.set({} as IPokemonTypeRelations);
    } finally {
      this.loading.set(false);
    }
  }

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
      this.#toastService.show('Erro ao buscar tipos.', 'error');
      this.typeData.set({} as IPokemonTypeRelations);
    }
  }

  public getPokemonId(): number {
    return this.pokemon()!.id;
  }

  private loadSpecies(id: number) {
    this.#pokemonService.getPokemonSpecies(id).subscribe((sp) => {
      this.species.set(sp);
      /* Load the evolution chain */
      const evolutionUrl = sp.evolution_chain.url;
      const evoId = evolutionUrl.split('/').filter(Boolean).pop();
      if (evoId) {
        this.#pokemonService
          .getPokemonEvolutionChain(Number(evoId))
          .subscribe((evoData) => {
            this.evolutionChain.set(evoData);
          });
      }
    });
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  private buildEvolutionTree(node: any): EvolutionNode {
    const name = node.species.name;
    const speciesId = this.extractIdFromUrl(node.species.url);

    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;

    const evoDetails = node.evolution_details?.[0];
    let trigger = '';
    let details = '';
    if (evoDetails) {
      trigger = evoDetails.trigger?.name ?? '';

      if (evoDetails.min_level) {
        details = `Level ${evoDetails.min_level}`;
      } else if (evoDetails.item) {
        details = `Use ${evoDetails.item.name}`;
      } else if (evoDetails.held_item) {
        details = `Trade holding ${evoDetails.held_item.name}`;
      } else if (evoDetails.min_happiness) {
        details = 'High friendship';
      } else if (evoDetails.min_affection) {
        details = 'High affection';
      } else if (evoDetails.min_beauty) {
        details = `Beauty ${evoDetails.min_beauty}+`;
      }

      if (evoDetails.location) {
        details += details
          ? `, at ${evoDetails.location.name}`
          : `At ${evoDetails.location.name}`;
      }

      if (evoDetails.time_of_day && evoDetails.time_of_day.trim() !== '') {
        details += details
          ? `, during ${evoDetails.time_of_day}`
          : `During ${evoDetails.time_of_day}`;
      }

      if (evoDetails.known_move) {
        details = `Knowing move ${evoDetails.known_move.name}`;
      }

      if (evoDetails.known_move_type) {
        details = `Knowing a ${evoDetails.known_move_type.name}-type move`;
      }

      if (evoDetails.party_species) {
        details = `With ${evoDetails.party_species.name} in party`;
      }

      if (evoDetails.party_type) {
        details = `With a ${evoDetails.party_type.name}-type Pokémon in party`;
      }

      if (evoDetails.gender !== null) {
        details += details
          ? `, gender: ${evoDetails.gender === 1 ? 'female' : 'male'}`
          : `Gender: ${evoDetails.gender === 1 ? 'female' : 'male'}`;
      }

      if (evoDetails.needs_overworld_rain) {
        details += details ? ', while raining' : 'While raining';
      }

      if (evoDetails.turn_upside_down) {
        details += details
          ? ', turn console upside down'
          : 'Turn console upside down';
      }

      // ⭐ Caso: Tyrogue → Hitmonlee/Hitmonchan/Hitmontop
      if (
        evoDetails.relative_physical_stats !== null &&
        evoDetails.relative_physical_stats !== undefined
      ) {
        const stat = evoDetails.relative_physical_stats;

        if (stat === 1) {
          details = 'Attack > Defense';
        } else if (stat === 0) {
          details = 'Attack = Defense';
        } else if (stat === -1) {
          details = 'Defense > Attack';
        }
      }
    }

    const children = (node.evolves_to || []).map((e: any) =>
      this.buildEvolutionTree(e)
    );

    const isParallel = children.length > 1;

    // Agora o layoutClass realmente será enviado ao componente
    const layoutClass = isParallel
      ? children.length % 2 === 0
        ? 'grid-2'
        : 'grid-3'
      : undefined;

    const isParallelWithFinals =
      isParallel &&
      children.length > 0 &&
      children.every(
        (c: any) => Array.isArray(c.children) && c.children.length === 1
      );

    return {
      name,
      image,
      trigger,
      details,
      isParallel,
      isParallelWithFinals,
      layoutClass,
      children,
    };
  }
}
