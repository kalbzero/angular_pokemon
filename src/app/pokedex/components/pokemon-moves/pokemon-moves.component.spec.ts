import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PokemonMovesComponent } from './pokemon-moves.component';
import { IPokemon } from '../../../shared/interfaces/IPokemon';

describe('PokemonMovesComponent', () => {
  let component: PokemonMovesComponent;
  let fixture: ComponentFixture<PokemonMovesComponent>;

  const mockPokemon: IPokemon = {
    id: 1,
    name: 'bulbasaur',
    moves: [
      {
        move: { name: 'razor-leaf', url: '' },
        version_group_details: [],
      },
      {
        move: { name: 'vine-whip', url: '' },
        version_group_details: [],
      },
      {
        move: { name: 'synthesis', url: '' },
        version_group_details: [],
      },
      {
        move: { name: 'growth', url: '' },
        version_group_details: [],
      },
    ],
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMovesComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonMovesComponent);
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

  describe('selectedMove signal', () => {
    it('should initialize as empty string', () => {
      expect(component.selectedMove()).toBe('');
    });

    it('should update selectedMove when set', () => {
      component.selectedMove.set('tackle');
      expect(component.selectedMove()).toBe('tackle');
    });
  });

  describe('modalOpen signal', () => {
    it('should initialize as false', () => {
      expect(component.modalOpen()).toBe(false);
    });

    it('should update modalOpen when set', () => {
      component.modalOpen.set(true);
      expect(component.modalOpen()).toBe(true);
    });

    it('should toggle modalOpen', () => {
      component.modalOpen.set(true);
      expect(component.modalOpen()).toBe(true);
      component.modalOpen.set(false);
      expect(component.modalOpen()).toBe(false);
    });
  });

  describe('openMove method', () => {
    it('should set selectedMove to the move name', () => {
      component.openMove('tackle');
      expect(component.selectedMove()).toBe('tackle');
    });

    it('should set modalOpen to true', () => {
      component.openMove('tackle');
      expect(component.modalOpen()).toBe(true);
    });

    it('should set both selectedMove and modalOpen together', () => {
      component.openMove('razor-leaf');
      expect(component.selectedMove()).toBe('razor-leaf');
      expect(component.modalOpen()).toBe(true);
    });

    it('should replace previous selectedMove when called again', () => {
      component.openMove('tackle');
      expect(component.selectedMove()).toBe('tackle');

      component.openMove('body-slam');
      expect(component.selectedMove()).toBe('body-slam');
      expect(component.modalOpen()).toBe(true);
    });

    it('should handle hyphenated move names', () => {
      component.openMove('thunder-punch');
      expect(component.selectedMove()).toBe('thunder-punch');
    });

    it('should handle single word move names', () => {
      component.openMove('scratch');
      expect(component.selectedMove()).toBe('scratch');
    });
  });

  describe('onCloseModal method', () => {
    it('should set modalOpen to false', () => {
      component.modalOpen.set(true);
      component.onCloseModal();
      expect(component.modalOpen()).toBe(false);
    });

    it('should set modalOpen to false when already false', () => {
      component.onCloseModal();
      expect(component.modalOpen()).toBe(false);
    });

    it('should keep selectedMove unchanged', () => {
      component.selectedMove.set('tackle');
      component.onCloseModal();
      expect(component.selectedMove()).toBe('tackle');
    });
  });

  describe('template rendering', () => {
    it('should render moves list when pokemon is provided', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      expect(movePills.length).toBe(4);
    });

    it('should display move names in titlecase', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      expect(movePills[0].textContent).toContain('Razor-leaf');
      expect(movePills[1].textContent).toContain('Vine-whip');
      expect(movePills[2].textContent).toContain('Synthesis');
      expect(movePills[3].textContent).toContain('Growth');
    });

    it('should call openMove when move pill is clicked', () => {
      spyOn(component, 'openMove');
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const firstMovePill = fixture.nativeElement.querySelector('.move-pill');
      firstMovePill.click();

      expect(component.openMove).toHaveBeenCalledWith('razor-leaf');
    });

    it('should render correct move name when clicked', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      movePills[2].click();

      expect(component.selectedMove()).toBe('synthesis');
      expect(component.modalOpen()).toBe(true);
    });

    it('should render card title', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const cardTitle = fixture.nativeElement.querySelector('.card-title');
      expect(cardTitle.textContent).toContain('Moves');
    });

    it('should render moves-list section', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movesList = fixture.nativeElement.querySelector('.moves-list');
      expect(movesList).toBeTruthy();
    });

    it('should render pokemon-move-modal component', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('pokemon-move-modal');
      expect(modal).toBeTruthy();
    });

    it('should update selectedMove when openMove is called', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      component.openMove('tackle');
      expect(component.selectedMove()).toBe('tackle');
    });

    it('should update modalOpen when openMove is called', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      component.openMove('tackle');
      expect(component.modalOpen()).toBe(true);
    });

    it('should handle pokemon with single move', () => {
      const singleMovePokemon: Partial<IPokemon> = {
        moves: [
          {
            move: { name: 'tackle', url: '' },
            version_group_details: [],
          },
        ],
      } as any;

      fixture.componentRef.setInput('pokemon', singleMovePokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      expect(movePills.length).toBe(1);
      expect(movePills[0].textContent).toContain('Tackle');
    });

    it('should handle pokemon with many moves', () => {
      const manyMovesPokemon: Partial<IPokemon> = {
        moves: Array.from({ length: 20 }, (_, i) => ({
          move: { name: `move-${i}`, url: '' },
          version_group_details: [],
        })),
      } as any;

      fixture.componentRef.setInput('pokemon', manyMovesPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      expect(movePills.length).toBe(20);
    });

    it('should apply move-pill class to each move', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      movePills.forEach((pill: HTMLElement) => {
        expect(pill.classList.contains('move-pill')).toBe(true);
      });
    });

    it('should handle undefined pokemon gracefully', () => {
      // Don't render template when pokemon is undefined - just test the state
      expect(component.pokemon()).toBeUndefined();
      expect(component.selectedMove()).toBe('');
      expect(component.modalOpen()).toBe(false);
    });
  });

  describe('modal interaction', () => {
    it('should open modal and set correct move on pill click', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');
      movePills[1].click();

      expect(component.selectedMove()).toBe('vine-whip');
      expect(component.modalOpen()).toBe(true);
    });

    it('should allow switching between moves', () => {
      fixture.componentRef.setInput('pokemon', mockPokemon as IPokemon);
      fixture.detectChanges();

      const movePills = fixture.nativeElement.querySelectorAll('.move-pill');

      movePills[0].click();
      expect(component.selectedMove()).toBe('razor-leaf');

      movePills[2].click();
      expect(component.selectedMove()).toBe('synthesis');

      movePills[3].click();
      expect(component.selectedMove()).toBe('growth');
    });

    it('should close modal through onCloseModal', () => {
      component.modalOpen.set(true);
      component.onCloseModal();
      expect(component.modalOpen()).toBe(false);
    });

    it('should maintain selectedMove after closing modal', () => {
      component.selectedMove.set('tackle');
      component.modalOpen.set(true);

      component.onCloseModal();

      expect(component.selectedMove()).toBe('tackle');
      expect(component.modalOpen()).toBe(false);
    });
  });
});
