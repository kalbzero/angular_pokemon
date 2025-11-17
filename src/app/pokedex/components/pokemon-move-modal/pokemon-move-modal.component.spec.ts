import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonMoveModalComponent } from './pokemon-move-modal.component';

describe('PokemonMoveModalComponent', () => {
  let component: PokemonMoveModalComponent;
  let fixture: ComponentFixture<PokemonMoveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMoveModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonMoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
