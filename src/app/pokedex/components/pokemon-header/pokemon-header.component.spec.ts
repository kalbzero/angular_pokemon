import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonHeaderComponent } from './pokemon-header.component';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

describe('PokemonHeaderComponent', () => {
  let component: PokemonHeaderComponent;
  let fixture: ComponentFixture<PokemonHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonHeaderComponent);
    component = fixture.componentInstance;
    // Provide default pokemon input to avoid template errors
    fixture.componentRef.setInput('pokemon', {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        front_default: 'https://example.com/bulbasaur.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/bulbasaur-official.png',
          },
        },
      },
    } as any);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the card container', () => {
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('.card');
    expect(card).toBeTruthy();
  });

  it('should display pokemon name and id in title with titlecase', () => {
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.card-title');
    expect(title.textContent).toContain('Bulbasaur');
    expect(title.textContent).toContain('#1');
  });

  it('should render the pokemon image with official artwork URL when available', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.poke-img');
    expect(img).toBeTruthy();
    expect(img.src).toBe('https://example.com/bulbasaur-official.png');
  });

  it('should fallback to front_default sprite when official artwork is unavailable', () => {
    const mockPokemonNoOfficial: Partial<IPokemon> = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://example.com/pikachu-default.png',
        other: {} as any,
      },
    } as any;

    fixture.componentRef.setInput('pokemon', mockPokemonNoOfficial);
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('.poke-img');
    expect(img.src).toBe('https://example.com/pikachu-default.png');
  });

  it('should use pokemon name as image alt text', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.poke-img');
    expect(img.alt).toBe('bulbasaur');
  });

  it('should apply titlecase pipe to pokemon name in title', () => {
    const mockPokemonLowercase: Partial<IPokemon> = {
      id: 4,
      name: 'charmander',
      sprites: {
        front_default: 'https://example.com/charmander.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/charmander-official.png',
          },
        },
      },
    } as any;

    fixture.componentRef.setInput('pokemon', mockPokemonLowercase);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.card-title');
    expect(title.textContent).toContain('Charmander');
  });

  it('should render poke-img with correct CSS class', () => {
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.poke-img');
    expect(img.classList.contains('poke-img')).toBe(true);
  });

  it('should display correct ID with hash symbol', () => {
    const mockPokemonHighId: Partial<IPokemon> = {
      id: 151,
      name: 'mew',
      sprites: {
        front_default: 'https://example.com/mew.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/mew-official.png',
          },
        },
      },
    } as any;

    fixture.componentRef.setInput('pokemon', mockPokemonHighId);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.card-title');
    expect(title.textContent).toContain('#151');
  });
});
