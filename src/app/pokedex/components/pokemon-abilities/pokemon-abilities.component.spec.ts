import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonAbilitiesComponent } from './pokemon-abilities.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

class MockPokemonStore {
  abilities = jasmine.createSpy('abilities');
}

describe('PokemonAbilitiesComponent', () => {
  let component: PokemonAbilitiesComponent;
  let fixture: ComponentFixture<PokemonAbilitiesComponent>;
  let mockStore: MockPokemonStore;

  beforeEach(async () => {
    mockStore = new MockPokemonStore();

    await TestBed.configureTestingModule({
      imports: [PokemonAbilitiesComponent],
      providers: [{ provide: PokemonStore, useValue: mockStore }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all abilities', () => {
    mockStore.abilities.and.returnValue([
      { name: 'overgrow', is_hidden: false, description: 'Increases damage.' },
      { name: 'chlorophyll', is_hidden: true, description: 'Increases speed.' }
    ]);

    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.ability-item');
    expect(items.length).toBe(2);
  });

  it('should show the title in titlecase', () => {
    mockStore.abilities.and.returnValue([
      { name: 'solar power', is_hidden: false, description: 'Increases damage.' }
    ]);

    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('.ability-name').textContent.trim();
    expect(name).toBe('Solar Power');
  });

  it('should show the description of ability', () => {
    mockStore.abilities.and.returnValue([
      { name: 'blaze', is_hidden: false, description: 'Fire Boost.' }
    ]);

    fixture.detectChanges();

    const desc = fixture.nativeElement.querySelector('.ability-description').textContent.trim();
    expect(desc).toBe('Fire Boost.');
  });

  it('should show "Hidden Ability" when is_hidden = true', () => {
    mockStore.abilities.and.returnValue([
      { name: 'chlorophyll', is_hidden: true, description: 'Speed increases.' }
    ]);

    fixture.detectChanges();

    const hiddenFlag = fixture.nativeElement.querySelector('.ability-hidden');
    expect(hiddenFlag).toBeTruthy();
  });

  it('não deve exibir "Hidden Ability" quando is_hidden = false', () => {
    mockStore.abilities.and.returnValue([
      { name: 'blaze', is_hidden: false, description: 'Boost em fogo.' }
    ]);

    fixture.detectChanges();

    const hiddenFlag = fixture.nativeElement.querySelector('.ability-hidden');
    expect(hiddenFlag).toBeNull();
  });

  it('should render zero abilities when the list comes empty', () => {
    mockStore.abilities.and.returnValue([]);

    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.ability-item');
    expect(items.length).toBe(0);
  });
});
