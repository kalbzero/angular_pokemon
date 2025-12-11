import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PokemonStatsComponent } from './pokemon-stats.component';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

describe('PokemonStatsComponent', () => {
  let component: PokemonStatsComponent;
  let fixture: ComponentFixture<PokemonStatsComponent>;

  const mockPokemon: IPokemon = {
    id: 1,
    name: 'bulbasaur',
    stats: [
      { stat: { name: 'hp', url: '' }, base_stat: 45 },
      { stat: { name: 'attack', url: '' }, base_stat: 49 },
      { stat: { name: 'defense', url: '' }, base_stat: 49 },
      { stat: { name: 'sp-atk', url: '' }, base_stat: 65 },
      { stat: { name: 'sp-def', url: '' }, base_stat: 65 },
      { stat: { name: 'speed', url: '' }, base_stat: 45 },
    ],
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonStatsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonStatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pokemon input', () => {
    it('should accept pokemon input', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();
      expect(component.pokemon()).toEqual(mockPokemon);
    });

    it('should initialize pokemon as undefined', () => {
      expect(component.pokemon()).toBeUndefined();
    });
  });

  describe('getStatPercent method', () => {
    it('should return 0 for stat value of 0', () => {
      const percent = component.getStatPercent(0);
      expect(percent).toBe(0);
    });

    it('should return 100 for maximum stat value (255)', () => {
      const percent = component.getStatPercent(255);
      expect(percent).toBe(100);
    });

    it('should return 50 for stat value of 127.5 (half of 255)', () => {
      const percent = component.getStatPercent(127.5);
      expect(percent).toBe(50);
    });

    it('should calculate percent correctly for typical stat (45)', () => {
      const percent = component.getStatPercent(45);
      // (45 / 255) * 100 = 17.647... → rounds to 18
      expect(percent).toBe(18);
    });

    it('should calculate percent correctly for high stat (100)', () => {
      const percent = component.getStatPercent(100);
      // (100 / 255) * 100 = 39.215... → rounds to 39
      expect(percent).toBe(39);
    });

    it('should round up correctly', () => {
      const percent = component.getStatPercent(129);
      // (129 / 255) * 100 = 50.588... → rounds to 51
      expect(percent).toBe(51);
    });

    it('should round down correctly', () => {
      const percent = component.getStatPercent(128);
      // (128 / 255) * 100 = 50.196... → rounds to 50
      expect(percent).toBe(50);
    });

    it('should handle floating point stats', () => {
      const percent = component.getStatPercent(75.5);
      // (75.5 / 255) * 100 = 29.607... → rounds to 30
      expect(percent).toBe(30);
    });
  });

  describe('getStatColor method', () => {
    it('should return stat-red for stat < 50 (weak)', () => {
      expect(component.getStatColor(49)).toBe('stat-red');
      expect(component.getStatColor(30)).toBe('stat-red');
      expect(component.getStatColor(1)).toBe('stat-red');
    });

    it('should return stat-orange for stat between 50 and 89 (medium)', () => {
      expect(component.getStatColor(50)).toBe('stat-orange');
      expect(component.getStatColor(70)).toBe('stat-orange');
      expect(component.getStatColor(89)).toBe('stat-orange');
    });

    it('should return stat-yellow for stat between 90 and 119 (good)', () => {
      expect(component.getStatColor(90)).toBe('stat-yellow');
      expect(component.getStatColor(100)).toBe('stat-yellow');
      expect(component.getStatColor(119)).toBe('stat-yellow');
    });

    it('should return stat-green for stat >= 120 (excellent)', () => {
      expect(component.getStatColor(120)).toBe('stat-green');
      expect(component.getStatColor(150)).toBe('stat-green');
      expect(component.getStatColor(255)).toBe('stat-green');
    });

    it('should handle edge cases at boundaries', () => {
      expect(component.getStatColor(49)).toBe('stat-red');
      expect(component.getStatColor(50)).toBe('stat-orange');
      expect(component.getStatColor(89)).toBe('stat-orange');
      expect(component.getStatColor(90)).toBe('stat-yellow');
      expect(component.getStatColor(119)).toBe('stat-yellow');
      expect(component.getStatColor(120)).toBe('stat-green');
    });

    it('should handle zero stat', () => {
      expect(component.getStatColor(0)).toBe('stat-red');
    });
  });

  describe('template rendering', () => {
    it('should render card title', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const cardTitle = fixture.nativeElement.querySelector('.card-title');
      expect(cardTitle.textContent).toContain('Status');
    });

    it('should render all stats from pokemon', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      expect(statRows.length).toBe(6); // bulbasaur has 6 stats
    });

    it('should display stat names in titlecase', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statLabels = fixture.nativeElement.querySelectorAll('.stat-label');
      expect(statLabels[0].textContent).toContain('Hp');
      expect(statLabels[1].textContent).toContain('Attack');
      expect(statLabels[2].textContent).toContain('Defense');
      expect(statLabels[3].textContent).toContain('Sp-atk');
      expect(statLabels[4].textContent).toContain('Sp-def');
      expect(statLabels[5].textContent).toContain('Speed');
    });

    it('should display base stat values', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statValues = fixture.nativeElement.querySelectorAll('.stat-value');
      expect(statValues[0].textContent).toContain('45');
      expect(statValues[1].textContent).toContain('49');
      expect(statValues[2].textContent).toContain('49');
      expect(statValues[3].textContent).toContain('65');
      expect(statValues[4].textContent).toContain('65');
      expect(statValues[5].textContent).toContain('45');
    });

    it('should render stat bars with correct width', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      expect(statFills.length).toBe(6);

      // Check first stat (45) - should be 18% width
      expect(statFills[0].style.width).toBe('18%');
    });

    it('should apply correct color classes to stat bars', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      
      // 45 should be red (< 50)
      expect(statFills[0].classList.contains('stat-red')).toBe(true);
      // 49 should be red (< 50)
      expect(statFills[1].classList.contains('stat-red')).toBe(true);
      // 65 should be orange (50-89)
      expect(statFills[3].classList.contains('stat-orange')).toBe(true);
    });

    it('should render stat-list section', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statList = fixture.nativeElement.querySelector('.stat-list');
      expect(statList).toBeTruthy();
    });

    it('should handle pokemon with different stat values', () => {
      const highStatPokemon: Partial<IPokemon> = {
        stats: [
          { stat: { name: 'hp', url: '' }, base_stat: 120 },
          { stat: { name: 'attack', url: '' }, base_stat: 150 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', highStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      // 120 should be yellow (90-119 boundary) and 47% width
      expect(statFills[0].classList.contains('stat-green')).toBe(true);
      // 150 should be green and 59% width
      expect(statFills[1].classList.contains('stat-green')).toBe(true);
    });

    it('should render single stat correctly', () => {
      const singleStatPokemon: Partial<IPokemon> = {
        stats: [{ stat: { name: 'hp', url: '' }, base_stat: 100 }],
      } as any;

      fixture.componentRef.setInput('pokemon', singleStatPokemon as IPokemon);
      fixture.detectChanges();

      const statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      expect(statRows.length).toBe(1);
    });

    it('should render many stats correctly', () => {
      const manyStatsPokemon: Partial<IPokemon> = {
        stats: Array.from({ length: 10 }, (_, i) => ({
          stat: { name: `stat-${i}`, url: '' },
          base_stat: 50 + i * 10,
        })),
      } as any;

      fixture.componentRef.setInput('pokemon', manyStatsPokemon as IPokemon);
      fixture.detectChanges();

      const statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      expect(statRows.length).toBe(10);
    });

    it('should apply stat-row class to each row', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      statRows.forEach((row: HTMLElement) => {
        expect(row.classList.contains('stat-row')).toBe(true);
      });
    });

    it('should update when pokemon input changes', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      let statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      expect(statRows.length).toBe(6);

      const newPokemon: Partial<IPokemon> = {
        stats: [{ stat: { name: 'hp', url: '' }, base_stat: 100 }],
      } as any;

      fixture.componentRef.setInput('pokemon', newPokemon as IPokemon);
      fixture.detectChanges();

      statRows = fixture.nativeElement.querySelectorAll('.stat-row');
      expect(statRows.length).toBe(1);
    });
  });

  describe('stat color distribution', () => {
    it('should correctly color weak stats', () => {
      const weakStatPokemon: Partial<IPokemon> = {
        stats: [
          { stat: { name: 'hp', url: '' }, base_stat: 30 },
          { stat: { name: 'attack', url: '' }, base_stat: 40 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', weakStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      expect(statFills[0].classList.contains('stat-red')).toBe(true);
      expect(statFills[1].classList.contains('stat-red')).toBe(true);
    });

    it('should correctly color medium stats', () => {
      const mediumStatPokemon: Partial<IPokemon> = {
        stats: [
          { stat: { name: 'hp', url: '' }, base_stat: 60 },
          { stat: { name: 'attack', url: '' }, base_stat: 80 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', mediumStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      expect(statFills[0].classList.contains('stat-orange')).toBe(true);
      expect(statFills[1].classList.contains('stat-orange')).toBe(true);
    });

    it('should correctly color good stats', () => {
      const goodStatPokemon: Partial<IPokemon> = {
        stats: [
          { stat: { name: 'hp', url: '' }, base_stat: 100 },
          { stat: { name: 'attack', url: '' }, base_stat: 110 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', goodStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      expect(statFills[0].classList.contains('stat-yellow')).toBe(true);
      expect(statFills[1].classList.contains('stat-yellow')).toBe(true);
    });

    it('should correctly color excellent stats', () => {
      const excellentStatPokemon: Partial<IPokemon> = {
        stats: [
          { stat: { name: 'hp', url: '' }, base_stat: 130 },
          { stat: { name: 'attack', url: '' }, base_stat: 255 },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', excellentStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFills = fixture.nativeElement.querySelectorAll('.stat-fill');
      expect(statFills[0].classList.contains('stat-green')).toBe(true);
      expect(statFills[1].classList.contains('stat-green')).toBe(true);
    });
  });

  describe('stat percent calculations', () => {
    it('should calculate percent for low stats', () => {
      const lowStatPokemon: Partial<IPokemon> = {
        stats: [{ stat: { name: 'hp', url: '' }, base_stat: 20 }],
      } as any;

      fixture.componentRef.setInput('pokemon', lowStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFill = fixture.nativeElement.querySelector('.stat-fill');
      // (20 / 255) * 100 = 7.84... → rounds to 8
      expect(statFill.style.width).toBe('8%');
    });

    it('should calculate percent for high stats', () => {
      const highStatPokemon: Partial<IPokemon> = {
        stats: [{ stat: { name: 'attack', url: '' }, base_stat: 200 }],
      } as any;

      fixture.componentRef.setInput('pokemon', highStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFill = fixture.nativeElement.querySelector('.stat-fill');
      // (200 / 255) * 100 = 78.43... → rounds to 78
      expect(statFill.style.width).toBe('78%');
    });

    it('should handle stat value of exactly 127 (half way)', () => {
      const halfStatPokemon: Partial<IPokemon> = {
        stats: [{ stat: { name: 'defense', url: '' }, base_stat: 127 }],
      } as any;

      fixture.componentRef.setInput('pokemon', halfStatPokemon as IPokemon);
      fixture.detectChanges();

      const statFill = fixture.nativeElement.querySelector('.stat-fill');
      // (127 / 255) * 100 = 49.8... → rounds to 50
      expect(statFill.style.width).toBe('50%');
    });
  });
});
