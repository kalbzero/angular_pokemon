import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypesAnalysisComponent } from './pokemon-types-analysis.component';

describe('PokemonTypesAnalysisComponent', () => {
  let component: PokemonTypesAnalysisComponent;
  let fixture: ComponentFixture<PokemonTypesAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypesAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTypesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
