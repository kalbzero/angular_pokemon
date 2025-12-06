import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonInfoComponent } from './pokemon-info.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { IPokemonSpecies } from '../../../shared/interfaces/IPokemonSpecies';

class MockPokemonStore {
  species = jasmine.createSpy('species').and.returnValue(null);
}

describe('PokemonInfoComponent', () => {
  let component: PokemonInfoComponent;
  let fixture: ComponentFixture<PokemonInfoComponent>;
  let mockStore: MockPokemonStore;

  beforeEach(async () => {
    mockStore = new MockPokemonStore();
    // Provide default species to prevent template errors
    mockStore.species.and.returnValue({
      base_happiness: 45,
      capture_rate: 45,
      color: { name: 'green', url: '' },
      shape: { name: 'quadruped', url: '' },
      egg_groups: [],
      habitat: { name: 'grassland', url: '' },
      genera: [],
      flavor_text_entries: [],
    } as any);

    await TestBed.configureTestingModule({
      imports: [PokemonInfoComponent],
      providers: [{ provide: PokemonStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonInfoComponent);
    component = fixture.componentInstance;
    // Provide default pokemon input
    fixture.componentRef.setInput('pokemon', {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
    } as any);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call store.species() in computed', () => {
    fixture.detectChanges();
    const sp = component.species();
    expect(mockStore.species).toHaveBeenCalled();
  });

  describe('description computed', () => {
    it('should return empty string when species is null', () => {
      mockStore.species.and.returnValue(null);
      expect(component.description()).toBe('');
    });

    it('should return Portuguese description when available', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        flavor_text_entries: [
          {
            language: { name: 'pt-BR', url: '' },
            flavor_text: 'Uma semente\npokémon\ncom características únicas.',
            version: { name: 'red', url: '' },
          },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      const desc = component.description();
      expect(desc).toContain('Uma semente');
      expect(desc).not.toContain('\n'); // newlines should be cleaned
    });

    it('should fallback to English description when Portuguese unavailable', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        flavor_text_entries: [
          {
            language: { name: 'en', url: '' },
            flavor_text: 'A seed pokemon with unique traits.',
            version: { name: 'red', url: '' },
          },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.description()).toBe('A seed pokemon with unique traits.');
    });

    it('should clean description by removing newlines and extra spaces', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        flavor_text_entries: [
          {
            language: { name: 'en', url: '' },
            flavor_text: 'A seed\n\npokémon  \t  with\r\ntraits.',
            version: { name: 'red', url: '' },
          },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      const desc = component.description();
      expect(desc).toBe('A seed pokémon with traits.');
    });

    it('should use first entry if no language match', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        flavor_text_entries: [
          {
            language: { name: 'ja', url: '' },
            flavor_text: 'Japanese text here.',
            version: { name: 'red', url: '' },
          },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.description()).toBe('Japanese text here.');
    });
  });

  describe('category computed', () => {
    it('should return empty string when species is null', () => {
      mockStore.species.and.returnValue(null);
      expect(component.category()).toBe('');
    });

    it('should return Portuguese category when available', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        genera: [
          { language: { name: 'pt-BR', url: '' }, genus: 'Pokémon Semente' },
          { language: { name: 'en', url: '' }, genus: 'Seed Pokémon' },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.category()).toBe('Pokémon Semente');
    });

    it('should fallback to English category when Portuguese unavailable', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        genera: [
          { language: { name: 'en', url: '' }, genus: 'Seed Pokémon' },
          { language: { name: 'ja', url: '' }, genus: '草ポケモン' },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.category()).toBe('Seed Pokémon');
    });

    it('should use first genus if no language match', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        genera: [
          { language: { name: 'ja', url: '' }, genus: 'Japanese genus' },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.category()).toBe('Japanese genus');
    });
  });

  describe('eggGroups computed', () => {
    it('should return empty array when species is null', () => {
      mockStore.species.and.returnValue(null);
      expect(component.eggGroups()).toEqual([]);
    });

    it('should return array of egg group names', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        egg_groups: [
          { name: 'monster', url: '' },
          { name: 'grass', url: '' },
        ],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.eggGroups()).toEqual(['monster', 'grass']);
    });

    it('should handle single egg group', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        egg_groups: [{ name: 'flying', url: '' }],
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.eggGroups()).toEqual(['flying']);
    });

    it('should return empty array when egg_groups is undefined', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        egg_groups: undefined,
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.eggGroups()).toEqual([]);
    });
  });

  describe('captureRate computed', () => {
    it('should return 0 percentage when capture_rate is 0', () => {
      const mockSpecies: Partial<IPokemonSpecies> = { capture_rate: 0 } as any;
      mockStore.species.and.returnValue(mockSpecies);

      expect(component.captureRate()).toBe('0.00');
    });

    it('should calculate capture rate percentage correctly', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        capture_rate: 45, // 45/255 * 100 ≈ 17.65%
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      const rate = parseFloat(component.captureRate());
      expect(rate).toBeCloseTo(17.65, 1);
    });

    it('should format capture rate to 2 decimal places', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        capture_rate: 100, // 100/255 * 100 ≈ 39.22%
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      const result = component.captureRate();
      expect(result).toMatch(/^\d+\.\d{2}$/); // matches format X.XX
    });

    it('should return 100 percentage when capture_rate is 255', () => {
      const mockSpecies: Partial<IPokemonSpecies> = {
        capture_rate: 255,
      } as any;
      mockStore.species.and.returnValue(mockSpecies);
      fixture.detectChanges();

      expect(component.captureRate()).toBe('100.00');
    });

    it('should return 0.00 when species is null', () => {
      mockStore.species.and.returnValue(null);

      expect(component.captureRate()).toBe('0.00');
    });
  });

  it('should render the info section card', () => {
    mockStore.species.and.returnValue({
      base_happiness: 45,
      capture_rate: 45,
      color: { name: 'green', url: '' },
      shape: { name: 'quadruped', url: '' },
      egg_groups: [],
      habitat: { name: 'grassland', url: '' },
      genera: [],
      flavor_text_entries: [],
    } as any);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('.info-section');
    expect(section).toBeTruthy();
  });
});
