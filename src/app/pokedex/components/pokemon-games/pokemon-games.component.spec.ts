import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonGamesComponent } from './pokemon-games.component';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

describe('PokemonGamesComponent', () => {
  let component: PokemonGamesComponent;
  let fixture: ComponentFixture<PokemonGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonGamesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonGamesComponent);
    component = fixture.componentInstance;
    // provide a default (empty) pokemon input so template won't access undefined
    fixture.componentRef.setInput('pokemon', { game_indices: [] } as any);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render game chips when game_indices provided', () => {
    const mockPokemon: Partial<IPokemon> = {
      game_indices: [
        { game_index: 1, version: { name: 'red', url: '/v/red' } },
        { game_index: 2, version: { name: 'blue', url: '/v/blue' } },
      ],
    } as any;

    // set input signal
    fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
    fixture.detectChanges();

    const chips: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('.game-chip');
    expect(chips.length).toBe(2);
    // Titlecase should have been applied in template (verify content)
    expect(chips[0]!.textContent!.trim()).toBe('Red');
    expect(chips[1]!.textContent!.trim()).toBe('Blue');
  });

  it('should render zero chips when game_indices is empty', () => {
    const mockPokemon: Partial<IPokemon> = { game_indices: [] } as any;
    fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
    fixture.detectChanges();

    const chips: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('.game-chip');
    expect(chips.length).toBe(0);
  });

  // Note: the template expects `pokemon()` to exist. We provide a default
  // empty `game_indices` input in `beforeEach` to avoid runtime template errors.
});
