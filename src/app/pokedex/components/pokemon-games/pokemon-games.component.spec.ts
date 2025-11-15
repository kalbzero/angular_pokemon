import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonGamesComponent } from './pokemon-games.component';

describe('PokemonGamesComponent', () => {
  let component: PokemonGamesComponent;
  let fixture: ComponentFixture<PokemonGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
