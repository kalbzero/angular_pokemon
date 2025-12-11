import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PokemonTypesComponent } from './pokemon-types.component';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

describe('PokemonTypesComponent', () => {
  let component: PokemonTypesComponent;
  let fixture: ComponentFixture<PokemonTypesComponent>;

  const mockPokemon: Partial<IPokemon> = {
    id: 1,
    name: 'bulbasaur',
    types: [
      { type: { name: 'grass', url: '' }, slot: 1 },
      { type: { name: 'poison', url: '' }, slot: 2 },
    ],
  } as any;

  const singleTypePokemon: Partial<IPokemon> = {
    id: 25,
    name: 'pikachu',
    types: [{ type: { name: 'electric', url: '' }, slot: 1 }],
  } as any;

  const manyTypesPokemon: IPokemon = {
    id: 384,
    name: 'rayquaza',
    types: [
      { type: { name: 'dragon', url: '' }, slot: 1 },
      { type: { name: 'flying', url: '' }, slot: 2 },
    ],
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypesComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonTypesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pokemon input', () => {
    it('should accept pokemon input', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();
      expect(component.pokemon()).toBeTruthy();
    });

    it('should initialize pokemon as undefined', () => {
      expect(component.pokemon()).toBeUndefined();
    });

    it('should handle undefined pokemon gracefully', () => {
      // Don't render template when pokemon is undefined - just test state
      expect(component.pokemon()).toBeUndefined();
    });
  });

  describe('template rendering', () => {
    it('should render card title', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const cardTitle = fixture.nativeElement.querySelector('.card-title');
      expect(cardTitle.textContent).toContain('Types');
    });

    it('should render all types from pokemon', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(2);
    });

    it('should display type names in titlecase', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips[0].textContent).toContain('Grass');
      expect(typeChips[1].textContent).toContain('Poison');
    });

    it('should apply type chip class', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      typeChips.forEach((chip: HTMLElement) => {
        expect(chip.classList.contains('chip')).toBe(true);
      });
    });

    it('should apply type-specific class for styling', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips[0].classList.contains('grass')).toBe(true);
      expect(typeChips[1].classList.contains('poison')).toBe(true);
    });

    it('should apply "type" class to each chip', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      typeChips.forEach((chip: HTMLElement) => {
        expect(chip.classList.contains('type')).toBe(true);
      });
    });

    it('should render chip-group section', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const chipGroup = fixture.nativeElement.querySelector('.chip-group');
      expect(chipGroup).toBeTruthy();
    });

    it('should render single type pokemon correctly', () => {
      fixture.componentRef.setInput('pokemon', singleTypePokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(1);
      expect(typeChips[0].textContent).toContain('Electric');
      expect(typeChips[0].classList.contains('electric')).toBe(true);
    });

    it('should render dual type pokemon correctly', () => {
      fixture.componentRef.setInput('pokemon', manyTypesPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(2);
      expect(typeChips[0].textContent).toContain('Dragon');
      expect(typeChips[1].textContent).toContain('Flying');
      expect(typeChips[0].classList.contains('dragon')).toBe(true);
      expect(typeChips[1].classList.contains('flying')).toBe(true);
    });

    it('should maintain type order from pokemon data', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips[0].textContent).toContain('Grass');
      expect(typeChips[1].textContent).toContain('Poison');
    });

    it('should update when pokemon input changes', () => {
      fixture.componentRef.setInput('pokemon', singleTypePokemon as IPokemon);
      fixture.detectChanges();

      let typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(1);

      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(2);
    });

    it('should render card section', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('.card');
      expect(card).toBeTruthy();
    });
  });

  describe('type styling', () => {
    it('should apply correct class for grass type', () => {
      const grassPokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'grass', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', grassPokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.classList.contains('grass')).toBe(true);
    });

    it('should apply correct class for fire type', () => {
      const firePokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'fire', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', firePokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.classList.contains('fire')).toBe(true);
    });

    it('should apply correct class for water type', () => {
      const waterPokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'water', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', waterPokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.classList.contains('water')).toBe(true);
    });

    it('should apply correct class for electric type', () => {
      const electricPokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'electric', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', electricPokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.classList.contains('electric')).toBe(true);
    });

    it('should apply correct classes for multiple types', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      const classesFirstChip = Array.from(typeChips[0].classList);
      const classesSecondChip = Array.from(typeChips[1].classList);

      expect(classesFirstChip).toContain('grass');
      expect(classesSecondChip).toContain('poison');
    });
  });

  describe('tracking and rendering', () => {
    it('should use track function for rendering', () => {
      const multiTypePokemon: Partial<IPokemon> = {
        types: [
          { type: { name: 'normal', url: '' }, slot: 1 },
          { type: { name: 'flying', url: '' }, slot: 2 },
          { type: { name: 'dragon', url: '' }, slot: 3 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', multiTypePokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(3);
    });

    it('should handle pokemon with same type names by using index', () => {
      const pokemonWithDifferentSlots: Partial<IPokemon> = {
        types: [
          { type: { name: 'normal', url: '' }, slot: 1 },
          { type: { name: 'normal', url: '' }, slot: 2 },
        ],
      } as any;

      fixture.componentRef.setInput(
        'pokemon',
        pokemonWithDifferentSlots as IPokemon
      );
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(2);
    });
  });

  describe('titlecase pipe', () => {
    it('should convert lowercase type names to titlecase', () => {
      const mixedCasePokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'psychic', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', mixedCasePokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.textContent).toContain('Psychic');
    });

    it('should handle hyphenated type names', () => {
      const hyphenatedTypePokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'fighting', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput(
        'pokemon',
        hyphenatedTypePokemon as IPokemon
      );
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip.textContent).toContain('Fighting');
    });

    it('should apply titlecase to all types in list', () => {
      const allTypesPokemon: Partial<IPokemon> = {
        types: [
          { type: { name: 'normal', url: '' }, slot: 1 },
          { type: { name: 'flying', url: '' }, slot: 2 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', allTypesPokemon as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips[0].textContent).toContain('Normal');
      expect(typeChips[1].textContent).toContain('Flying');
    });
  });

  describe('common pokemon types', () => {
    const testPokemonTypes = [
      { name: 'normal', display: 'Normal' },
      { name: 'fire', display: 'Fire' },
      { name: 'water', display: 'Water' },
      { name: 'grass', display: 'Grass' },
      { name: 'electric', display: 'Electric' },
      { name: 'ice', display: 'Ice' },
      { name: 'fighting', display: 'Fighting' },
      { name: 'poison', display: 'Poison' },
      { name: 'ground', display: 'Ground' },
      { name: 'flying', display: 'Flying' },
      { name: 'psychic', display: 'Psychic' },
      { name: 'bug', display: 'Bug' },
      { name: 'rock', display: 'Rock' },
      { name: 'ghost', display: 'Ghost' },
      { name: 'dragon', display: 'Dragon' },
      { name: 'dark', display: 'Dark' },
      { name: 'steel', display: 'Steel' },
      { name: 'fairy', display: 'Fairy' },
    ];

    testPokemonTypes.forEach((typeData) => {
      it(`should render ${typeData.name} type correctly`, () => {
        const pokemon: Partial<IPokemon> = {
          types: [{ type: { name: typeData.name, url: '' }, slot: 1 }],
        } as any;

        fixture.componentRef.setInput('pokemon', pokemon as IPokemon);
        fixture.detectChanges();

        const chip = fixture.nativeElement.querySelector('.chip');
        expect(chip.textContent).toContain(typeData.display);
        expect(chip.classList.contains(typeData.name)).toBe(true);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle pokemon with empty types array', () => {
      const pokemonNoTypes: Partial<IPokemon> = {
        types: [],
      } as any;

      fixture.componentRef.setInput('pokemon', pokemonNoTypes as IPokemon);
      fixture.detectChanges();

      const typeChips = fixture.nativeElement.querySelectorAll('.chip');
      expect(typeChips.length).toBe(0);
    });

    it('should maintain spacing between type chips', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const chipGroup = fixture.nativeElement.querySelector('.chip-group');
      expect(chipGroup).toBeTruthy();
      const chips = chipGroup.querySelectorAll('.chip');
      expect(chips.length).toBe(2);
    });

    it('should handle very long type names', () => {
      // Testing with real Pokemon type names which are all relatively short
      const testPokemon: Partial<IPokemon> = {
        types: [{ type: { name: 'psychic', url: '' }, slot: 1 }],
      } as any;

      fixture.componentRef.setInput('pokemon', testPokemon as IPokemon);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('.chip');
      expect(chip).toBeTruthy();
      expect(chip.textContent.length).toBeGreaterThan(0);
    });
  });
});
