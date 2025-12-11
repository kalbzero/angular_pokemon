import { TestBed } from '@angular/core/testing';
import { PokemonStore } from './pokemon-store.service';
import { PokemonService } from '../providers/pokemon.service';
import { UtilsService } from '../services/utils.service';
import { ToastService } from '../services/toast.service';
import { of, throwError } from 'rxjs';
import { IPokemon } from '../interfaces/IPokemon';
import { IPokemonTypeRelations } from '../interfaces/IPokemonTypeRelations';
import { IPokemonAbility } from '../interfaces/IPokemonAbility';
import { IPokemonSpecies } from '../interfaces/IPokemonSpecies';
import { IPokemonEvolutionChain, EvolutionNode } from '../interfaces/IPokemonEvolutionChain';

describe('PokemonStore', () => {
  let store: PokemonStore;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let utilsService: jasmine.SpyObj<UtilsService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockPokemon: IPokemon = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    is_main_series: true,
    order: 1,
    sprites: {
      front_default: 'https://example.com/front.png',
      other: { 'official-artwork': { front_default: 'https://example.com/art.png' } },
    } as any,
    types: [
      { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
      { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
    ],
    abilities: [
      {
        ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: { name: 'chlorophyll', url: 'https://pokeapi.co/api/v2/ability/34/' },
        is_hidden: true,
        slot: 3,
      },
    ],
    moves: [],
    stats: [],
    species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
  } as any;

  const mockTypeRelations: IPokemonTypeRelations = {
    weaknesses: ['fire (x2)', 'flying (x2)', 'ice (x2)', 'psychic (x2)'],
    resistances: ['grass (x0.5)', 'water (x0.5)'],
    immunities: [],
  };

  const mockAbility: any = {
    name: 'overgrow',
    effect_entries: [
      { effect: 'Powers up Grass-type moves when hit.', language: { name: 'en' } },
    ],
  };

  const mockSpecies: IPokemonSpecies = {
    id: 1,
    name: 'bulbasaur',
    gender_rate: 1,
    capture_rate: 45,
    base_happiness: 50,
    hatch_counter: 20,
    has_gender_differences: true,
    generation: { name: 'generation-i', url: 'https://pokeapi.co/api/v2/generation/1/' },
    egg_groups: [{ name: 'monster', url: 'https://pokeapi.co/api/v2/egg-group/1/' }],
    habitat: { name: 'grassland', url: 'https://pokeapi.co/api/v2/habitat/3/' },
    flavor_text_entries: [{ flavor_text: 'Test flavor', language: { name: 'en' } }],
    evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
  } as any;

  const mockEvolutionChain: IPokemonEvolutionChain = {
    id: 1,
    baby_trigger_item: null,
    chain: {
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      evolves_to: [
        {
          species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          evolution_details: [{ min_level: 16, trigger: { name: 'level-up' } }],
          evolves_to: [
            {
              species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              evolution_details: [{ min_level: 32, trigger: { name: 'level-up' } }],
              evolves_to: [],
            },
          ],
        },
      ],
    } as any,
  };

  beforeEach(() => {
    const pokemonServiceSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemon',
      'getPokemonType',
      'getAbility',
      'getPokemonSpecies',
      'getPokemonEvolutionChain',
    ]);

    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['calculateEffectiveness']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        PokemonStore,
        { provide: PokemonService, useValue: pokemonServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    });

    store = TestBed.inject(PokemonStore);
    pokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    utilsService = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should initialize signals with correct default values', () => {
      expect(store.loading()).toBe(false);
      expect(store.pokemon()).toBeUndefined();
      expect(store.species()).toEqual({} as any);
      expect(store.abilities()).toEqual([]);
      expect(store.evolutionChain()).toEqual({} as any);
      expect(store.typeData()).toEqual({} as any);
    });
  });

  describe('fetchPokemon', () => {
    beforeEach(() => {
      pokemonService.getPokemon.and.returnValue(of(mockPokemon));
      pokemonService.getPokemonType.and.returnValue(of({} as any));
      pokemonService.getPokemonSpecies.and.returnValue(of(mockSpecies));
      pokemonService.getPokemonEvolutionChain.and.returnValue(of(mockEvolutionChain));
      pokemonService.getAbility.and.returnValue(of(mockAbility));
      utilsService.calculateEffectiveness.and.returnValue(mockTypeRelations);
    });

    it('should set loading to true while fetching', async () => {
      const promise = store.fetchPokemon('bulbasaur');
      expect(store.loading()).toBe(true);
      await promise;
      expect(store.loading()).toBe(false);
    });

    it('should fetch pokemon and set it to signal', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(store.pokemon()).toEqual(mockPokemon);
    });

    it('should fetch pokemon types after fetching pokemon', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(pokemonService.getPokemonType).toHaveBeenCalledWith('grass');
      expect(pokemonService.getPokemonType).toHaveBeenCalledWith('poison');
    });

    it('should calculate type effectiveness', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(utilsService.calculateEffectiveness).toHaveBeenCalled();
      expect(store.typeData()).toEqual(mockTypeRelations);
    });

    it('should fetch species and evolution chain', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(pokemonService.getPokemonSpecies).toHaveBeenCalledWith(1);
      expect(pokemonService.getPokemonEvolutionChain).toHaveBeenCalledWith(1);
    });

    it('should set species when fetched', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(store.species()).toEqual(mockSpecies);
    });

    it('should set evolution chain when fetched', async () => {
      await store.fetchPokemon('bulbasaur');
      expect(store.evolutionChain()).toEqual(mockEvolutionChain);
    });

    it('should handle 404 error with appropriate message', async () => {
      pokemonService.getPokemon.and.returnValue(throwError(() => ({ status: 404 })));
      await store.fetchPokemon('nonexistent');
      expect(toastService.show).toHaveBeenCalledWith("O Pokémon 'nonexistent' não existe.", 'error');
      expect(store.pokemon()).toBeUndefined();
      expect(store.typeData()).toEqual({} as any);
    });

    it('should handle not-found error message', async () => {
      pokemonService.getPokemon.and.returnValue(
        throwError(() => ({ message: 'not-found' }))
      );
      await store.fetchPokemon('invalid');
      expect(toastService.show).toHaveBeenCalledWith("O Pokémon 'invalid' não existe.", 'error');
    });

    it('should handle generic error', async () => {
      pokemonService.getPokemon.and.returnValue(
        throwError(() => ({ status: 500, message: 'Server error' }))
      );
      await store.fetchPokemon('bulbasaur');
      expect(toastService.show).toHaveBeenCalledWith('Pokémon não encontrado.', 'error');
      expect(store.pokemon()).toBeUndefined();
    });

    it('should reset pokemon and typeData on error', async () => {
      store.pokemon.set(mockPokemon);
      store.typeData.set(mockTypeRelations);
      pokemonService.getPokemon.and.returnValue(throwError(() => ({ status: 500 })));
      await store.fetchPokemon('bulbasaur');
      expect(store.pokemon()).toBeUndefined();
      expect(store.typeData()).toEqual({} as any);
    });

    it('should set loading to false finally', async () => {
      pokemonService.getPokemon.and.returnValue(throwError(() => ({ status: 404 })));
      await store.fetchPokemon('nonexistent');
      expect(store.loading()).toBe(false);
    });
  });

  describe('fetchPokemonTypes', () => {
    it('should fetch all pokemon types', async () => {
      const mockType1 = { name: 'grass', damage_relations: {} } as any;
      const mockType2 = { name: 'poison', damage_relations: {} } as any;
      pokemonService.getPokemonType.and.returnValue(of(mockType1));
      utilsService.calculateEffectiveness.and.returnValue(mockTypeRelations);

      await store.fetchPokemonTypes(['grass', 'poison']);

      expect(pokemonService.getPokemonType).toHaveBeenCalledWith('grass');
      expect(pokemonService.getPokemonType).toHaveBeenCalledWith('poison');
    });

    it('should calculate effectiveness with fetched types', async () => {
      const mockType = { name: 'grass', damage_relations: {} } as any;
      pokemonService.getPokemonType.and.returnValue(of(mockType));
      utilsService.calculateEffectiveness.and.returnValue(mockTypeRelations);

      await store.fetchPokemonTypes(['grass']);

      expect(utilsService.calculateEffectiveness).toHaveBeenCalled();
      expect(store.typeData()).toEqual(mockTypeRelations);
    });

    it('should handle error when fetching types', async () => {
      pokemonService.getPokemonType.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      await store.fetchPokemonTypes(['grass']);

      expect(toastService.show).toHaveBeenCalledWith('Erro ao buscar tipos.', 'error');
      expect(store.typeData()).toEqual({} as any);
    });

    it('should handle empty types array', async () => {
      utilsService.calculateEffectiveness.and.returnValue(mockTypeRelations);

      await store.fetchPokemonTypes([]);

      expect(utilsService.calculateEffectiveness).toHaveBeenCalledWith([]);
    });
  });

  describe('evolutionList computed', () => {
    it('should return empty array when evolution chain is empty', () => {
      store.evolutionChain.set({} as any);
      expect(store.evolutionList()).toEqual([]);
    });

    it('should build evolution list from chain', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const list = store.evolutionList();

      expect(list.length).toBe(3);
      expect(list[0].name).toBe('bulbasaur');
      expect(list[0].id).toBe(1);
      expect(list[1].name).toBe('ivysaur');
      expect(list[1].id).toBe(2);
      expect(list[2].name).toBe('venusaur');
      expect(list[2].id).toBe(3);
    });

    it('should extract id from species url', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const list = store.evolutionList();

      list.forEach((evo) => {
        expect(evo.id).toBeGreaterThan(0);
      });
    });

    it('should generate correct image urls', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const list = store.evolutionList();

      expect(list[0].image).toContain('official-artwork');
      expect(list[0].image).toContain('/1.png');
    });

    it('should handle single evolution', () => {
      const singleEvo: IPokemonEvolutionChain = {
        id: 1,
        baby_trigger_item: null,
        chain: {
          species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
          evolves_to: [],
        } as any,
      };
      store.evolutionChain.set(singleEvo);
      const list = store.evolutionList();

      expect(list.length).toBe(1);
      expect(list[0].name).toBe('eevee');
      expect(list[0].id).toBe(133);
    });
  });

  describe('evolutionTree computed', () => {
    it('should return null when evolution chain is empty', () => {
      store.evolutionChain.set({} as any);
      expect(store.evolutionTree()).toBeNull();
    });

    it('should build evolution tree from chain', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const tree = store.evolutionTree();

      expect(tree).toBeTruthy();
      expect(tree!.name).toBe('bulbasaur');
      expect(tree!.children.length).toBe(1);
    });

    it('should set isParallel true for multiple children', () => {
      const chainWithMultipleEvos: IPokemonEvolutionChain = {
        id: 1,
        baby_trigger_item: null,
        chain: {
          species: { name: 'tyrogue', url: 'https://pokeapi.co/api/v2/pokemon-species/236/' },
          evolves_to: [
            {
              species: { name: 'hitmonlee', url: 'https://pokeapi.co/api/v2/pokemon-species/106/' },
              evolution_details: [{ relative_physical_stats: 1 }],
              evolves_to: [],
            },
            {
              species: { name: 'hitmonchan', url: 'https://pokeapi.co/api/v2/pokemon-species/107/' },
              evolution_details: [{ relative_physical_stats: -1 }],
              evolves_to: [],
            },
          ],
        } as any,
      };
      store.evolutionChain.set(chainWithMultipleEvos);
      const tree = store.evolutionTree();

      expect(tree!.isParallel).toBe(true);
      expect(tree!.children.length).toBe(2);
    });

    it('should set correct layoutClass for 2 children', () => {
      const twoEvoChain: IPokemonEvolutionChain = {
        id: 1,
        baby_trigger_item: null,
        chain: {
          species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
          evolves_to: [
            {
              species: { name: 'vaporeon', url: 'https://pokeapi.co/api/v2/pokemon-species/134/' },
              evolution_details: [{}],
              evolves_to: [],
            },
            {
              species: { name: 'jolteon', url: 'https://pokeapi.co/api/v2/pokemon-species/135/' },
              evolution_details: [{}],
              evolves_to: [],
            },
          ],
        } as any,
      };
      store.evolutionChain.set(twoEvoChain);
      const tree = store.evolutionTree();

      expect(tree!.layoutClass).toBe('grid-2');
    });

    it('should set correct layoutClass for 3 children', () => {
      const threeEvoChain: IPokemonEvolutionChain = {
        id: 1,
        baby_trigger_item: null,
        chain: {
          species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
          evolves_to: [
            {
              species: { name: 'vaporeon', url: 'https://pokeapi.co/api/v2/pokemon-species/134/' },
              evolution_details: [{}],
              evolves_to: [],
            },
            {
              species: { name: 'jolteon', url: 'https://pokeapi.co/api/v2/pokemon-species/135/' },
              evolution_details: [{}],
              evolves_to: [],
            },
            {
              species: { name: 'flareon', url: 'https://pokeapi.co/api/v2/pokemon-species/136/' },
              evolution_details: [{}],
              evolves_to: [],
            },
          ],
        } as any,
      };
      store.evolutionChain.set(threeEvoChain);
      const tree = store.evolutionTree();

      expect(tree!.layoutClass).toBe('grid-3');
    });

    it('should handle evolution with min_level detail', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const tree = store.evolutionTree();

      expect(tree!.children[0].details).toContain('Level 16');
    });

    it('should handle evolution with item detail', () => {
      const itemEvo: IPokemonEvolutionChain = {
        id: 1,
         baby_trigger_item: null,
        chain: {
          species: { name: 'test', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          evolves_to: [
            {
              species: { name: 'test2', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
              evolution_details: [{ item: { name: 'stone' } }],
              evolves_to: [],
            },
          ],
        } as any,
      };
      store.evolutionChain.set(itemEvo);
      const tree = store.evolutionTree();

      expect(tree!.children[0].details).toContain('Use stone');
    });

    it('should generate correct image urls for evolution nodes', () => {
      store.evolutionChain.set(mockEvolutionChain);
      const tree = store.evolutionTree();

      expect(tree!.image).toContain('official-artwork');
      expect(tree!.image).toContain('/1.png');
      expect(tree!.children[0].image).toContain('official-artwork');
      expect(tree!.children[0].image).toContain('/2.png');
    });
  });

  describe('getPokemonId', () => {
    it('should return pokemon id from signal', () => {
      store.pokemon.set(mockPokemon);
      expect(store.getPokemonId()).toBe(1);
    });

    it('should return different id for different pokemon', () => {
      const otherPokemon = { ...mockPokemon, id: 25 };
      store.pokemon.set(otherPokemon);
      expect(store.getPokemonId()).toBe(25);
    });
  });

  describe('abilities effect', () => {
    it('should load abilities when pokemon changes', async () => {
      pokemonService.getAbility.and.returnValue(of(mockAbility));

      store.pokemon.set(mockPokemon);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(pokemonService.getAbility).toHaveBeenCalledWith('overgrow');
      expect(pokemonService.getAbility).toHaveBeenCalledWith('chlorophyll');
    });

    it('should clear abilities when pokemon is set to undefined', async () => {
      pokemonService.getAbility.and.returnValue(of(mockAbility));
      store.pokemon.set(mockPokemon);
      await new Promise((resolve) => setTimeout(resolve, 100));

      store.pokemon.set(undefined);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(store.abilities()).toEqual([]);
    });

    it('should populate ability details from api response', async () => {
      pokemonService.getAbility.and.returnValue(of(mockAbility));

      store.pokemon.set(mockPokemon);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const abilities = store.abilities();
      expect(abilities.length).toBeGreaterThan(0);
      const firstAbility = abilities.find((a) => a.name === 'overgrow');
      expect(firstAbility).toBeTruthy();
      expect(firstAbility!.description).toContain('Powers up Grass-type moves');
    });

    it('should handle ability without english effect', async () => {
      const abilityWithoutEn = { effect_entries: [] } as unknown as IPokemonAbility;
      pokemonService.getAbility.and.returnValue(of(abilityWithoutEn));

      store.pokemon.set(mockPokemon);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const abilities = store.abilities();
      const firstAbility = abilities[0];
      expect(firstAbility.description).toBe('No description available.');
    });

    it('should preserve is_hidden and slot from original ability', async () => {
      pokemonService.getAbility.and.returnValue(of(mockAbility));

      store.pokemon.set(mockPokemon);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const abilities = store.abilities();
      const hiddenAbility = abilities.find((a) => a.is_hidden);
      expect(hiddenAbility).toBeTruthy();
      expect(hiddenAbility!.is_hidden).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should load complete pokemon data on successful fetch', async () => {
      pokemonService.getPokemon.and.returnValue(of(mockPokemon));
      pokemonService.getPokemonType.and.returnValue(of({} as any));
      pokemonService.getPokemonSpecies.and.returnValue(of(mockSpecies));
      pokemonService.getPokemonEvolutionChain.and.returnValue(of(mockEvolutionChain));
      pokemonService.getAbility.and.returnValue(of(mockAbility));
      utilsService.calculateEffectiveness.and.returnValue(mockTypeRelations);

      await store.fetchPokemon('bulbasaur');
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(store.pokemon()).toEqual(mockPokemon);
      expect(store.species()).toEqual(mockSpecies);
      expect(store.evolutionChain()).toEqual(mockEvolutionChain);
      expect(store.typeData()).toEqual(mockTypeRelations);
      expect(store.abilities().length).toBeGreaterThan(0);
      expect(store.evolutionList().length).toBeGreaterThan(0);
      expect(store.evolutionTree()).toBeTruthy();
    });

    it('should handle evolution chain with multiple branches', async () => {
      const complexChain: IPokemonEvolutionChain = {
        id: 1,
        baby_trigger_item: null,
        chain: {
          species: { name: 'wurmple', url: 'https://pokeapi.co/api/v2/pokemon-species/265/' },
          evolves_to: [
            {
              species: { name: 'silcoon', url: 'https://pokeapi.co/api/v2/pokemon-species/266/' },
              evolution_details: [{}],
              evolves_to: [
                {
                  species: { name: 'beautifly', url: 'https://pokeapi.co/api/v2/pokemon-species/267/' },
                  evolution_details: [{}],
                  evolves_to: [],
                },
              ],
            },
            {
              species: { name: 'cascoon', url: 'https://pokeapi.co/api/v2/pokemon-species/268/' },
              evolution_details: [{}],
              evolves_to: [
                {
                  species: { name: 'dustox', url: 'https://pokeapi.co/api/v2/pokemon-species/269/' },
                  evolution_details: [{}],
                  evolves_to: [],
                },
              ],
            },
          ],
        } as any,
      };

      store.evolutionChain.set(complexChain);
      const tree = store.evolutionTree();

      expect(tree!.isParallel).toBe(true);
      expect(tree!.children.length).toBe(2);
      expect(tree!.children[0].children.length).toBe(1);
      expect(tree!.children[1].children.length).toBe(1);
    });
  });
});
