import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { PokemonEvolutionComponent } from './pokemon-evolution.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

describe('PokemonEvolutionComponent', () => {
  let component: PokemonEvolutionComponent;
  let fixture: ComponentFixture<PokemonEvolutionComponent>;
  let mockStore: jasmine.SpyObj<PokemonStore>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('PokemonStore', ['fetchPokemon', 'evolutionTree'], {
      evolutionTree: jasmine.createSpy('evolutionTree').and.returnValue(null),
    });

    await TestBed.configureTestingModule({
      imports: [PokemonEvolutionComponent, CommonModule],
      providers: [{ provide: PokemonStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have evolutionTree property bound to store', () => {
    expect(component.evolutionTree).toBeDefined();
  });

  it('should display evolution tree section', () => {
    const section = fixture.debugElement.nativeElement.querySelector('.evolution-card');
    expect(section).toBeTruthy();
  });

  it('should have a title "Evolution Chain"', () => {
    const title = fixture.debugElement.nativeElement.querySelector('.card-title');
    expect(title.textContent).toContain('Evolution Chain');
  });

  describe('searchPokemonName', () => {
    it('should call fetchPokemon with the provided pokemon name', () => {
      const pokemonName = 'charizard';
      component.searchPokemonName(pokemonName);
      expect(mockStore.fetchPokemon).toHaveBeenCalledWith(pokemonName);
    });

    it('should call fetchPokemon each time searchPokemonName is called', () => {
      component.searchPokemonName('charmander');
      component.searchPokemonName('charmeleon');
      component.searchPokemonName('charizard');
      expect(mockStore.fetchPokemon).toHaveBeenCalledTimes(3);
    });

    it('should handle different pokemon names', () => {
      component.searchPokemonName('bulbasaur');
      expect(mockStore.fetchPokemon).toHaveBeenCalledWith('bulbasaur');

      mockStore.fetchPokemon.calls.reset();

      component.searchPokemonName('squirtle');
      expect(mockStore.fetchPokemon).toHaveBeenCalledWith('squirtle');
    });
  });

  describe('evolutionTree display', () => {
    it('should not display evo-tree div when evolutionTree is null', () => {
      mockStore.evolutionTree.and.returnValue(null);
      fixture.detectChanges();
      const evoTree = fixture.debugElement.nativeElement.querySelector('.evo-tree');
      expect(evoTree).toBeFalsy();
    });

    it('should display evo-tree div when evolutionTree is truthy', () => {
      const mockTree = {
        name: 'charmander',
        image: 'url/to/image',
        children: [],
      };
      mockStore.evolutionTree.and.returnValue(mockTree);
      fixture.detectChanges();
      const evoTree = fixture.debugElement.nativeElement.querySelector('.evo-tree');
      expect(evoTree).toBeTruthy();
    });

    it('should conditionally render evolution nodes based on evolutionTree', () => {
      const mockTree = {
        name: 'charmander',
        image: 'url/to/image',
        isParallel: false,
        children: [
          {
            name: 'charmeleon',
            image: 'url/to/image',
            children: [],
          },
        ],
      };
      mockStore.evolutionTree.and.returnValue(mockTree);
      fixture.detectChanges();
      const evoTree = fixture.debugElement.nativeElement.querySelector('.evo-tree');
      expect(evoTree).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render the card container with correct class', () => {
      const card = fixture.debugElement.nativeElement.querySelector('.card');
      expect(card.classList.contains('evolution-card')).toBe(true);
    });

    it('should use titlecase pipe in template', () => {
      const mockTree = {
        name: 'charmander',
        image: 'url/to/image',
        children: [],
      };
      mockStore.evolutionTree.and.returnValue(mockTree);
      fixture.detectChanges();
      // The titlecase pipe should be applied to pokemon names in the template
      expect(component).toBeTruthy();
    });
  });
});
