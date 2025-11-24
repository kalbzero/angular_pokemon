import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedexComponent } from './pokedex.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

class MockPokemonStore {
  fetchPokemon = jasmine.createSpy('fetchPokemon');
  loading = jasmine.createSpy('loading').and.returnValue(false);
  pokemon = jasmine.createSpy('pokemon').and.returnValue(null);
}

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let mockStore: MockPokemonStore;

  beforeEach(async () => {
    mockStore = new MockPokemonStore();

    await TestBed.configureTestingModule({
      imports: [PokedexComponent],
      providers: [{ provide: PokemonStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.fetchPokemon when search has value', () => {
    component.search = 'pikachu';

    component.buscar();

    expect(mockStore.fetchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('should not call store.fetchPokemon when search is empty', () => {
    component.search = '';

    component.buscar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });

  it('should not call store.fetchPokemon when search has only spaces', () => {
    component.search = '   ';

    component.buscar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });

  it('should call buscar() when the button is clicked', () => {
    spyOn(component, 'buscar');
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.buscar).toHaveBeenCalled();
  });

  // Testes para o spinner de loading
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
