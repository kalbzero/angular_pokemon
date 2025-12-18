import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexComponent } from './pokedex.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { PokemonService } from '../../../shared/providers/pokemon.service';
import { of } from 'rxjs';

class MockPokemonStore {
  fetchPokemon = jasmine.createSpy('fetchPokemon');
  loading = jasmine.createSpy('loading').and.returnValue(false);
  pokemon = jasmine.createSpy('pokemon').and.returnValue(null);
}

class MockPokemonService {
  getPokemonList = jasmine.createSpy('getPokemonList').and.returnValue(
    of({ results: [] })
  );
}

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let mockStore: MockPokemonStore;
  let mockPokemonService: MockPokemonService;

  beforeEach(async () => {
    mockStore = new MockPokemonStore();
    mockPokemonService = new MockPokemonService();

    await TestBed.configureTestingModule({
      imports: [PokedexComponent],
      providers: [
        { provide: PokemonStore, useValue: mockStore },
        { provide: PokemonService, useValue: mockPokemonService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.fetchPokemon when search has value', () => {
    component.search.set('pikachu');

    component.searchbar();

    expect(mockStore.fetchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('should not call store.fetchPokemon when search is empty', () => {
    component.search.set('');

    component.searchbar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });

  it('should not call store.fetchPokemon when search has only spaces', () => {
    component.search.set('   ');

    component.searchbar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });

  it('should call searchbar() when the button is clicked', () => {
    spyOn(component, 'searchbar');
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.searchbar).toHaveBeenCalled();
  });

  // Tests to the spinner of the loading
  it('should display the spinner when store.loading() returns true', () => {
    mockStore.loading.and.returnValue(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.loading-overlay');
    expect(spinner).toBeTruthy();
  });

  it('should not display the spinner when store.loading() returns false', () => {
    mockStore.loading.and.returnValue(false);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.loading-overlay');
    expect(spinner).toBeFalsy();
  });
});
