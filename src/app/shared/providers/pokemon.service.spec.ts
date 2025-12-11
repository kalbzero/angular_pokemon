import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://pokeapi.co/api/v2/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemon', () => {
    it('should fetch pokemon by name', () => {
      const mockPokemon = { id: 1, name: 'bulbasaur' } as any;

      service.getPokemon('bulbasaur').subscribe((pokemon) => {
        expect(pokemon.name).toBe('bulbasaur');
        expect(pokemon.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/bulbasaur`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemon);
    });

    it('should convert pokemon name to lowercase', () => {
      const mockPokemon = { id: 1, name: 'bulbasaur' } as any;

      service.getPokemon('BULBASAUR').subscribe((pokemon) => {
        expect(pokemon.name).toBe('bulbasaur');
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/bulbasaur`);
      req.flush(mockPokemon);
    });

    it('should handle 404 error with custom error message', (done) => {
      service.getPokemon('nonexistent').subscribe({
        next: () => fail('should have failed with 404'),
        error: (err) => {
          expect(err.message).toBe('not-found');
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/nonexistent`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });

    it('should handle other HTTP errors', (done) => {
      service.getPokemon('bulbasaur').subscribe({
        next: () => fail('should have failed with error'),
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/bulbasaur`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should include all pokemon properties in response', () => {
      const mockPokemon = {
        id: 4,
        name: 'charmander',
        height: 6,
        weight: 85,
        stats: [{ stat: { name: 'hp' }, base_stat: 39 }],
        types: [{ type: { name: 'fire' } }],
        abilities: [{ ability: { name: 'blaze' } }],
        moves: [{ move: { name: 'scratch' } }],
      } as any;

      service.getPokemon('charmander').subscribe((pokemon) => {
        expect(pokemon.height).toBe(6);
        expect(pokemon.weight).toBe(85);
        expect(pokemon.stats.length).toBe(1);
        expect(pokemon.types.length).toBe(1);
        expect(pokemon.abilities.length).toBe(1);
        expect(pokemon.moves.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/charmander`);
      req.flush(mockPokemon);
    });
  });

  describe('getPokemonType', () => {
    it('should fetch pokemon type by name', () => {
      const mockType = {
        id: 1,
        name: 'normal',
        damage_relations: {
          double_damage_from: [],
          double_damage_to: [],
          half_damage_from: [],
          half_damage_to: [],
          no_damage_from: [],
          no_damage_to: [],
        },
      } as any;

      service.getPokemonType('normal').subscribe((type) => {
        expect(type.name).toBe('normal');
        expect(type.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}type/normal`);
      expect(req.request.method).toBe('GET');
      req.flush(mockType);
    });

    it('should convert type name to lowercase', () => {
      const mockType = {
        id: 10,
        name: 'water',
        damage_relations: {
          double_damage_from: [],
          double_damage_to: [],
          half_damage_from: [],
          half_damage_to: [],
          no_damage_from: [],
          no_damage_to: [],
        },
      } as any;

      service.getPokemonType('WATER').subscribe((type) => {
        expect(type.name).toBe('water');
      });

      const req = httpMock.expectOne(`${baseUrl}type/water`);
      req.flush(mockType);
    });

    it('should include damage relations in response', () => {
      const mockType = {
        id: 2,
        name: 'fire',
        damage_relations: {
          double_damage_from: [{ name: 'water' }],
          double_damage_to: [{ name: 'grass' }],
          half_damage_from: [{ name: 'fire' }],
          half_damage_to: [{ name: 'water' }],
          no_damage_from: [],
          no_damage_to: [],
        },
      } as any;

      service.getPokemonType('fire').subscribe((type) => {
        expect(type.damage_relations).toBeTruthy();
        expect(type.damage_relations.double_damage_from.length).toBe(1);
        expect(type.damage_relations.double_damage_to.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}type/fire`);
      req.flush(mockType);
    });
  });

  describe('getPokemonSpecies', () => {
    it('should fetch pokemon species by id', () => {
      const mockSpecies = {
        id: 1,
        name: 'bulbasaur',
        color: { name: 'green' },
        flavor_text_entries: [],
        growth_rate: { name: 'medium' },
        egg_groups: [],
        capture_rate: 45,
        evolution_chain: { url: 'evolution_url' },
        gender_rate: 1,
        hatch_counter: 20,
      } as any;

      service.getPokemonSpecies(1).subscribe((species) => {
        expect(species.name).toBe('bulbasaur');
        expect(species.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon-species/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSpecies);
    });

    it('should handle species with different ids', () => {
      const mockSpecies = {
        id: 150,
        name: 'mewtwo',
        color: { name: 'purple' },
        flavor_text_entries: [],
        growth_rate: { name: 'slow' },
        egg_groups: [],
        capture_rate: 3,
        evolution_chain: { url: 'evolution_url' },
        gender_rate: -1,
        hatch_counter: 120,
      } as any;

      service.getPokemonSpecies(150).subscribe((species) => {
        expect(species.capture_rate).toBe(3);
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon-species/150`);
      req.flush(mockSpecies);
    });

    it('should include all species properties in response', () => {
      const mockSpecies = {
        id: 4,
        name: 'charmander',
        color: { name: 'red' },
        flavor_text_entries: [{ flavor_text: 'Fire lizard pokemon' }],
        growth_rate: { name: 'medium-slow' },
        egg_groups: [{ name: 'monster' }],
        capture_rate: 45,
        evolution_chain: { url: 'evolution_url' },
        gender_rate: 1,
        hatch_counter: 20,
      } as any;

      service.getPokemonSpecies(4).subscribe((species) => {
        expect(species.color).toBeTruthy();
        expect(species.flavor_text_entries.length).toBe(1);
        expect(species.egg_groups.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon-species/4`);
      req.flush(mockSpecies);
    });
  });

  describe('getAbility', () => {
    it('should fetch ability by name', () => {
      const mockAbility = {
        id: 1,
        name: 'stench',
        effect_entries: [],
        pokemon: [],
      } as any;

      service.getAbility('stench').subscribe((ability) => {
        expect(ability.name).toBe('stench');
      });

      const req = httpMock.expectOne(`${baseUrl}ability/stench`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAbility);
    });

    it('should convert ability name to lowercase', () => {
      const mockAbility = {
        id: 9,
        name: 'blaze',
        effect_entries: [],
        pokemon: [],
      } as any;

      service.getAbility('BLAZE').subscribe((ability) => {
        expect(ability.name).toBe('blaze');
      });

      const req = httpMock.expectOne(`${baseUrl}ability/blaze`);
      req.flush(mockAbility);
    });

    it('should include ability properties in response', () => {
      const mockAbility = {
        id: 9,
        name: 'blaze',
        effect_entries: [{ effect: 'Fire-type moves deal 1.5x damage', language: { name: 'en' } }],
        pokemon: [{ pokemon: { name: 'charmander' } }],
      } as any;

      service.getAbility('blaze').subscribe((ability) => {
        expect(ability.name).toBe('blaze');
      });

      const req = httpMock.expectOne(`${baseUrl}ability/blaze`);
      req.flush(mockAbility);
    });
  });

  describe('getPokemonMove', () => {
    it('should fetch move by name', () => {
      const mockMove = {
        id: 1,
        name: 'pound',
        power: 40,
        accuracy: 100,
        type: { name: 'normal' },
        damage_class: { name: 'physical' },
        effect_entries: [],
        target: { name: 'single-target' },
      } as any;

      service.getPokemonMove('pound').subscribe((move) => {
        expect(move.name).toBe('pound');
        expect(move.id).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}move/pound`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMove);
    });

    it('should convert move name to lowercase', () => {
      const mockMove = {
        id: 5,
        name: 'mega-punch',
        power: 80,
        accuracy: 85,
        type: { name: 'normal' },
        damage_class: { name: 'physical' },
        effect_entries: [],
        target: { name: 'single-target' },
      } as any;

      service.getPokemonMove('MEGA-PUNCH').subscribe((move) => {
        expect(move.name).toBe('mega-punch');
      });

      const req = httpMock.expectOne(`${baseUrl}move/mega-punch`);
      req.flush(mockMove);
    });

    it('should include all move properties in response', () => {
      const mockMove = {
        id: 10,
        name: 'scratch',
        power: 40,
        accuracy: 100,
        type: { name: 'normal' },
        damage_class: { name: 'physical' },
        effect_entries: [{ effect: 'Normal attack' }],
        target: { name: 'single-target' },
      } as any;

      service.getPokemonMove('scratch').subscribe((move) => {
        expect(move.power).toBe(40);
        expect(move.accuracy).toBe(100);
        expect(move.type.name).toBe('normal');
        expect(move.damage_class.name).toBe('physical');
        expect(move.effect_entries.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}move/scratch`);
      req.flush(mockMove);
    });

    it('should handle moves with null power (status moves)', () => {
      const mockMove = {
        id: 21,
        name: 'thunder-wave',
        power: null,
        accuracy: 90,
        type: { name: 'electric' },
        damage_class: { name: 'status' },
        effect_entries: [],
        target: { name: 'single-target' },
      } as any;

      service.getPokemonMove('thunder-wave').subscribe((move) => {
        expect(move.power).toBeNull();
        expect(move.damage_class.name).toBe('status');
      });

      const req = httpMock.expectOne(`${baseUrl}move/thunder-wave`);
      req.flush(mockMove);
    });
  });

  describe('getPokemonEvolutionChain', () => {
    it('should fetch evolution chain by id', () => {
      const mockChain = {
        id: 1,
        chain: {
          species: { name: 'bulbasaur' },
          evolves_to: [],
        },
      } as any;

      service.getPokemonEvolutionChain(1).subscribe((chain) => {
        expect(chain.id).toBe(1);
        expect(chain.chain.species.name).toBe('bulbasaur');
      });

      const req = httpMock.expectOne(`${baseUrl}evolution-chain/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockChain);
    });

    it('should include evolution details in response', () => {
      const mockChain = {
        id: 2,
        chain: {
          species: { name: 'charmander' },
          evolves_to: [
            {
              species: { name: 'charmeleon' },
              evolution_details: [{ min_level: 16 }],
              evolves_to: [
                {
                  species: { name: 'charizard' },
                  evolution_details: [{ min_level: 36 }],
                  evolves_to: [],
                },
              ],
            },
          ],
        },
      } as any;

      service.getPokemonEvolutionChain(2).subscribe((chain) => {
        expect(chain.chain.evolves_to.length).toBe(1);
        expect(chain.chain.evolves_to[0].species.name).toBe('charmeleon');
        expect(chain.chain.evolves_to[0].evolves_to[0].species.name).toBe('charizard');
      });

      const req = httpMock.expectOne(`${baseUrl}evolution-chain/2`);
      req.flush(mockChain);
    });

    it('should handle complex evolution chains', () => {
      const mockChain = {
        id: 3,
        chain: {
          species: { name: 'eevee' },
          evolves_to: [
            {
              species: { name: 'vaporeon' },
              evolution_details: [{ trigger: { name: 'use-item' }, item: { name: 'water-stone' } }],
              evolves_to: [],
            },
            {
              species: { name: 'jolteon' },
              evolution_details: [{ trigger: { name: 'use-item' }, item: { name: 'thunder-stone' } }],
              evolves_to: [],
            },
            {
              species: { name: 'flareon' },
              evolution_details: [{ trigger: { name: 'use-item' }, item: { name: 'fire-stone' } }],
              evolves_to: [],
            },
          ],
        },
      } as any;

      service.getPokemonEvolutionChain(3).subscribe((chain) => {
        expect(chain.chain.evolves_to.length).toBe(3);
      });

      const req = httpMock.expectOne(`${baseUrl}evolution-chain/3`);
      req.flush(mockChain);
    });
  });

  describe('service configuration', () => {
    it('should use correct base URL', () => {
      const mockPokemon = { id: 1, name: 'bulbasaur' } as any;

      service.getPokemon('bulbasaur').subscribe();

      const req = httpMock.expectOne((request) => {
        return request.url.startsWith('https://pokeapi.co/api/v2/');
      });
      expect(req.request.url).toContain('pokeapi.co');
      req.flush(mockPokemon);
    });

    it('should be provided in root', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should throw error for network failures', (done) => {
      service.getPokemon('bulbasaur').subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}pokemon/bulbasaur`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should distinguish between 404 and other errors', (done) => {
      let count = 0;

      // First request - 404
      service.getPokemon('notfound').subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err.message).toBe('not-found');
          count++;
          if (count === 2) done();
        },
      });

      const req1 = httpMock.expectOne(`${baseUrl}pokemon/notfound`);
      req1.flush(null, { status: 404, statusText: 'Not Found' });

      // Second request - 500
      service.getPokemon('error').subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err.status).toBe(500);
          count++;
          if (count === 2) done();
        },
      });

      const req2 = httpMock.expectOne(`${baseUrl}pokemon/error`);
      req2.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });
});
