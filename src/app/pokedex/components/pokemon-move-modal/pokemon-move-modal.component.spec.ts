import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PokemonMoveModalComponent } from './pokemon-move-modal.component';
import { PokemonService } from '../../../shared/providers/pokemon.service';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { IPokemonMove } from '../../../shared/interfaces/IPokemonMove';

describe('PokemonMoveModalComponent', () => {
  let component: PokemonMoveModalComponent;
  let fixture: ComponentFixture<PokemonMoveModalComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockPokemonStore: jasmine.SpyObj<PokemonStore>;

  const mockMove: IPokemonMove = {
    name: 'tackle',
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    effect_chance: null,
    type: { name: 'normal', url: '' },
    damage_class: { name: 'physical', url: '' },
    target: { name: 'single-target', url: '' },
    effect_entries: [
      {
        language: { name: 'en', url: '' },
        short_effect: 'Inflicts regular damage.',
        effect: 'Inflicts regular damage with no additional effect.',
      },
    ],
    meta: {
      crit_rate: 0,
      healing: null,
      drain: null,
      ailment: { name: 'none', url: '' },
      ailment_chance: 0,
      min_hits: null,
      max_hits: null,
      min_turns: null,
      max_turns: null,
    },
    contest_type: { name: 'tough', url: '' },
  } as any;

  const mockPokemon = {
    types: [
      { type: { name: 'normal', url: '' } },
      { type: { name: 'flying', url: '' } },
    ],
  };

  const mockTypeData = {
    effectiveness: {
      normal: 1,
      fire: 1.5,
    },
  };

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonService', [
      'getPokemonMove',
    ]);
    mockPokemonStore = jasmine.createSpyObj('PokemonStore', [], {
      pokemon: jasmine.createSpy().and.returnValue(mockPokemon),
      typeData: jasmine.createSpy().and.returnValue(mockTypeData),
    });

    mockPokemonService.getPokemonMove.and.returnValue(of(mockMove));

    await TestBed.configureTestingModule({
      imports: [PokemonMoveModalComponent],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: PokemonStore, useValue: mockPokemonStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonMoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('moveName input', () => {
    it('should accept a required move name input', () => {
      fixture.componentRef.setInput('moveName', 'tackle');
      expect(component.moveName()).toBe('tackle');
    });
  });

  describe('visible model', () => {
    it('should initialize visible as false', () => {
      expect(component.visible()).toBe(false);
    });

    it('should update visible model', () => {
      component.visible.set(true);
      expect(component.visible()).toBe(true);
    });
  });

  describe('closeModal output', () => {
    it('should emit closeModal when close() is called', () => {
      spyOn(component.closeModal, 'emit');
      component.close();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should set visible to false when close() is called', () => {
      component.visible.set(true);
      component.close();
      expect(component.visible()).toBe(false);
    });
  });

  describe('ngOnChanges', () => {
    it('should fetch move when visible is true and moveName is set', () => {
      fixture.componentRef.setInput('moveName', 'tackle');
      component.visible.set(true);
      component.ngOnChanges();

      expect(mockPokemonService.getPokemonMove).toHaveBeenCalledWith('tackle');
    });

    it('should not fetch move when visible is false', () => {
      fixture.componentRef.setInput('moveName', 'tackle');
      component.visible.set(false);
      component.ngOnChanges();

      expect(mockPokemonService.getPokemonMove).not.toHaveBeenCalled();
    });

    it('should set move signal with fetched data', () => {
      fixture.componentRef.setInput('moveName', 'tackle');
      component.visible.set(true);
      component.ngOnChanges();

      expect(component.move()).toEqual(mockMove);
    });

    it('should fetch different move when moveName changes', () => {
      fixture.componentRef.setInput('moveName', 'tackle');
      component.visible.set(true);
      component.ngOnChanges();

      expect(mockPokemonService.getPokemonMove).toHaveBeenCalledWith('tackle');

      mockPokemonService.getPokemonMove.calls.reset();
      fixture.componentRef.setInput('moveName', 'body-slam');
      component.ngOnChanges();

      expect(mockPokemonService.getPokemonMove).toHaveBeenCalledWith(
        'body-slam'
      );
    });
  });

  describe('description computed', () => {
    it('should return empty string when move is null', () => {
      expect(component.description()).toBe('');
    });

    it('should return English effect description when available', () => {
      component.move.set(mockMove as IPokemonMove);

      expect(component.description()).toBe('Inflicts regular damage.');
    });

    it('should return "No description." when no effect entries exist', () => {
      const moveWithoutEffects = {
        ...mockMove,
        effect_entries: [],
      } as any;
      component.move.set(moveWithoutEffects);

      expect(component.description()).toBe('No description.');
    });

    it('should return "No description." when effect_entries is undefined', () => {
      const moveWithoutEffects = {
        ...mockMove,
        effect_entries: undefined,
      } as any;
      component.move.set(moveWithoutEffects);

      expect(component.description()).toBe('No description.');
    });

    it('should prioritize English effect entry', () => {
      const moveWithMultipleLanguages = {
        ...mockMove,
        effect_entries: [
          {
            language: { name: 'ja', url: '' },
            short_effect: '通常のダメージを与える',
          },
          {
            language: { name: 'en', url: '' },
            short_effect: 'Inflicts regular damage.',
          },
          {
            language: { name: 'pt-BR', url: '' },
            short_effect: 'Causa dano normal.',
          },
        ],
      } as any;
      component.move.set(moveWithMultipleLanguages);

      expect(component.description()).toBe('Inflicts regular damage.');
    });
  });

  describe('damageInfo computed', () => {
    it('should return null when move is null', () => {
      expect(component.damageInfo()).toBeNull();
    });

    it('should return null when pokemon is null', () => {
      (mockPokemonStore.pokemon as jasmine.Spy).and.returnValue(null);
      component.move.set(mockMove as IPokemonMove);

      expect(component.damageInfo()).toBeNull();
    });

    it('should return null when typeData is null', () => {
      (mockPokemonStore.typeData as jasmine.Spy).and.returnValue(null);
      component.move.set(mockMove as IPokemonMove);

      expect(component.damageInfo()).toBeNull();
    });

    it('should calculate damage with STAB bonus when move type matches pokemon type', () => {
      component.move.set(mockMove as IPokemonMove);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.base).toBe(40); // move.power
      expect(damageInfo?.stab).toBe(1.5); // has STAB
      expect(damageInfo?.effectiveness).toBe(1); // effectiveness from typeData
      expect(damageInfo?.finalDamage).toBe(60); // 40 * 1.5 * 1
    });

    it('should calculate damage without STAB when move type does not match pokemon type', () => {
      const fireMove = {
        ...mockMove,
        type: { name: 'fire', url: '' },
      } as any;
      component.move.set(fireMove);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.stab).toBe(1); // no STAB
      expect(damageInfo?.effectiveness).toBe(1.5); // fire type effectiveness
      expect(damageInfo?.finalDamage).toBe(60); // 40 * 1 * 1.5
    });

    it('should handle moves with no power value', () => {
      const moveNoPower = {
        ...mockMove,
        power: null,
      } as any;
      component.move.set(moveNoPower);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.base).toBe(0);
      expect(damageInfo?.finalDamage).toBe(0); // 0 * stab * eff
    });

    it('should use default effectiveness of 1 when type not in effectiveness map', () => {
      const unknownTypeMove = {
        ...mockMove,
        type: { name: 'unknown-type', url: '' },
      } as any;
      component.move.set(unknownTypeMove);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.effectiveness).toBe(1);
      expect(damageInfo?.finalDamage).toBe(40); // 40 * 1 * 1
    });

    it('should correctly round final damage', () => {
      const moveWithOddDamage = {
        ...mockMove,
        power: 25, // 25 * 1.5 * 1 = 37.5 -> rounds to 38
      } as any;
      component.move.set(moveWithOddDamage);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.finalDamage).toBe(38);
    });

    it('should handle multiple pokemon types and find STAB', () => {
      const flyingMove = {
        ...mockMove,
        type: { name: 'flying', url: '' },
      } as any;
      component.move.set(flyingMove);

      const damageInfo = component.damageInfo();
      expect(damageInfo?.stab).toBe(1.5); // pokemon has flying type as second type
    });
  });

  describe('close method', () => {
    it('should set visible to false', () => {
      component.visible.set(true);
      component.close();
      expect(component.visible()).toBe(false);
    });

    it('should emit closeModal output', () => {
      spyOn(component.closeModal, 'emit');
      component.close();
      expect(component.closeModal.emit).toHaveBeenCalledWith();
    });
  });

  describe('move signal', () => {
    it('should initialize as null', () => {
      expect(component.move()).toBeNull();
    });

    it('should update move signal when set', () => {
      component.move.set(mockMove as IPokemonMove);
      expect(component.move()).toEqual(mockMove);
    });
  });
});
