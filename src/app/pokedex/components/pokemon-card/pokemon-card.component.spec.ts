import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardComponent } from './pokemon-card.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

class MockPokemonStore {
  typeData = jasmine.createSpy('typeData').and.returnValue({
    weaknesses: ['water'],
    resistances: ['grass'],
    immunities: ['electric'],
    effectiveness: { fire: 2, grass: 0.5 },
  });
  species = jasmine.createSpy('species').and.returnValue({
    flavor_text_entries: [
      {
        language: { name: 'en' },
        flavor_text: 'A small seed pokemon'
      }
    ]
  });
  abilities = jasmine.createSpy('abilities').and.returnValue([]);
  evolutionTree = jasmine.createSpy('evolutionTree').and.returnValue(null);
  evolutionList = jasmine.createSpy('evolutionList').and.returnValue([]);
  pokemon = jasmine.createSpy('pokemon').and.returnValue(null);
  fetchPokemon = jasmine.createSpy('fetchPokemon').and.returnValue(null);
}

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;
  let mockStore: MockPokemonStore;

  beforeEach(async () => {
    mockStore = new MockPokemonStore();
    await TestBed.configureTestingModule({
      // declarations: [PokemonCardComponent],
      imports: [PokemonCardComponent],
      providers: [
        { provide: PokemonStore, useValue: mockStore },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // <-- ignora componentes filhos,que são irrelevantes para o teste atual
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    
    // Set a mock Pokemon object using component inputs
    const mockPokemon: IPokemon = {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        front_default: 'https://example.com/bulbasaur.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/bulbasaur-official.png'
          }
        }
      }
    } as IPokemon;
    
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar typeData() do store ao inicializar', () => {
    expect(mockStore.typeData).toHaveBeenCalled();
  });

  it('deve retornar weaknesses corretas do computed', () => {
    expect(component.weaknesses()).toEqual(['water']);
  });

  it('deve retornar resistances corretas do computed', () => {
    expect(component.resistances()).toEqual(['grass']);
  });

  it('deve retornar immunities corretas do computed', () => {
    expect(component.immunities()).toEqual(['electric']);
  });

  it('deve montar effectivenessEntries como array de pares [key, value]', () => {
    const entries = component.effectivenessEntries();
    expect(entries).toEqual([
      ['fire', 2],
      ['grass', 0.5],
    ]);
  });

  // it('não deve quebrar se pokemon = undefined', () => {
  //   component.pokemon.set(undefined);
  //   fixture.detectChanges();

  //   expect(component).toBeTruthy(); // apenas garantindo que não deu erro
  // });
});
