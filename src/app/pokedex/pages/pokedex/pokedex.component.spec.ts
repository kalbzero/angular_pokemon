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
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar store.fetchPokemon quando search tiver valor', () => {
    component.search = 'pikachu';

    component.buscar();

    expect(mockStore.fetchPokemon).toHaveBeenCalledWith('pikachu');
  });

  it('não deve chamar store.fetchPokemon quando search estiver vazio', () => {
    component.search = '';

    component.buscar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });

  it('não deve chamar store.fetchPokemon quando search tiver só espaços', () => {
    component.search = '   ';

    component.buscar();

    expect(mockStore.fetchPokemon).not.toHaveBeenCalled();
  });
});
