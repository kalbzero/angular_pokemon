import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PokemonTypesAnalysisComponent } from './pokemon-types-analysis.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

describe('PokemonTypesAnalysisComponent', () => {
  let component: PokemonTypesAnalysisComponent;
  let fixture: ComponentFixture<PokemonTypesAnalysisComponent>;
  let mockPokemonStore: jasmine.SpyObj<PokemonStore>;

  const mockTypeData = {
    weaknesses: ['water', 'grass', 'ice'],
    resistances: ['normal', 'flying', 'rock'],
    immunities: ['poison'],
    effectiveness: {
      fire: 0.5,
      water: 2,
      grass: 0.5,
      electric: 1,
      ice: 2,
    },
  };

  beforeEach(async () => {
    mockPokemonStore = jasmine.createSpyObj('PokemonStore', [], {
      typeData: jasmine.createSpy().and.returnValue(mockTypeData),
    });

    await TestBed.configureTestingModule({
      imports: [PokemonTypesAnalysisComponent],
      providers: [
        { provide: PokemonStore, useValue: mockPokemonStore },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonTypesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('typeData computed', () => {
    it('should return typeData from store', () => {
      expect(component.typeData()).toEqual(mockTypeData);
    });
  });

  describe('weaknesses computed', () => {
    it('should return weaknesses from typeData', () => {
      expect(component.weaknesses()).toEqual(['water', 'grass', 'ice']);
    });
  });

  describe('resistances computed', () => {
    it('should return resistances from typeData', () => {
      expect(component.resistances()).toEqual(['normal', 'flying', 'rock']);
    });
  });

  describe('immunities computed', () => {
    it('should return immunities from typeData', () => {
      expect(component.immunities()).toEqual(['poison']);
    });
  });

  describe('effectiveness computed', () => {
    it('should return effectiveness from typeData', () => {
      expect(component.effectiveness()).toEqual({
        fire: 0.5,
        water: 2,
        grass: 0.5,
        electric: 1,
        ice: 2,
      });
    });
  });

  describe('effectivenessKeyed computed', () => {
    it('should convert effectiveness object to array of key-value pairs', () => {
      const keyed = component.effectivenessKeyed();
      expect(Array.isArray(keyed)).toBe(true);
      expect(keyed.length).toBe(5);
    });

    it('should have correct structure with key and value properties', () => {
      const keyed = component.effectivenessKeyed();
      keyed.forEach((item: any) => {
        expect(item.key).toBeDefined();
        expect(item.value).toBeDefined();
        expect(typeof item.key).toBe('string');
        expect(typeof item.value).toBe('number');
      });
    });

    it('should preserve all keys and values from effectiveness object', () => {
      const keyed = component.effectivenessKeyed();
      const keys = keyed.map((item: any) => item.key);
      const values = keyed.map((item: any) => item.value);

      expect(keys).toContain('fire');
      expect(keys).toContain('water');
      expect(values).toContain(0.5);
      expect(values).toContain(2);
      expect(values).toContain(1);
    });
  });

  describe('template rendering', () => {
    it('should render card when typeData is available', () => {
      const card = fixture.nativeElement.querySelector('.card');
      expect(card).toBeTruthy();
    });

    it('should render card title', () => {
      const cardTitle = fixture.nativeElement.querySelector('.card-title');
      expect(cardTitle.textContent).toContain('Weaknesses and Resistances');
    });
  });

  describe('type effectiveness rendering', () => {
    it('should display effectiveness multiplier values', () => {
      const content = fixture.nativeElement.textContent;
      expect(content).toContain('0.5');
      expect(content).toContain('2');
    });
  });

  describe('edge cases', () => {
    it('should handle all computed properties when typeData contains all fields', () => {
      expect(component.typeData()).toBeTruthy();
      expect(component.weaknesses().length).toBe(3);
      expect(component.resistances().length).toBe(3);
      expect(component.immunities().length).toBe(1);
      expect(Object.keys(component.effectiveness()).length).toBe(5);
    });
  });

  describe('titlecase pipe application', () => {
    it('should capitalize weakness names in template', () => {
      const weaknessChips = fixture.nativeElement.querySelectorAll(
        '.type-section span'
      );
      Array.from(weaknessChips).forEach((chip: any) => {
        const text = chip.textContent.trim();
        if (text) {
          expect(text.charAt(0)).toEqual(text.charAt(0).toUpperCase());
        }
      });
    });
  });
});
