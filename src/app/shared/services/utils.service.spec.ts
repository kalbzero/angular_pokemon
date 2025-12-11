import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { IPokemonType } from '../interfaces/IPokemonType';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateEffectiveness', () => {
    it('should handle empty array', () => {
      const result = service.calculateEffectiveness([]);
      expect(result.weaknesses).toEqual([]);
      expect(result.resistances).toEqual([]);
      expect(result.immunities).toEqual([]);
    });

    it('should calculate effectiveness for single type - fire', () => {
      const fireType: IPokemonType = {
        id: 10,
        name: 'fire',
        damage_relations: {
          double_damage_from: [
            { name: 'water', url: '' },
            { name: 'ground', url: '' },
            { name: 'rock', url: '' },
          ],
          half_damage_from: [
            { name: 'bug', url: '' },
            { name: 'steel', url: '' },
            { name: 'grass', url: '' },
            { name: 'ice', url: '' },
            { name: 'fire', url: '' },
            { name: 'fairy', url: '' },
          ],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([fireType]);
      expect(result.weaknesses).toContain('ground (x2)');
      expect(result.weaknesses).toContain('rock (x2)');
      expect(result.weaknesses).toContain('water (x2)');
      expect(result.resistances).toContain('bug (x0.5)');
      expect(result.resistances).toContain('fire (x0.5)');
      expect(result.immunities).toEqual([]);
    });

    it('should calculate effectiveness for single type - water', () => {
      const waterType: IPokemonType = {
        id: 11,
        name: 'water',
        damage_relations: {
          double_damage_from: [
            { name: 'electric', url: '' },
            { name: 'grass', url: '' },
          ],
          half_damage_from: [
            { name: 'fire', url: '' },
            { name: 'water', url: '' },
            { name: 'ice', url: '' },
            { name: 'steel', url: '' },
          ],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([waterType]);
      expect(result.weaknesses).toContain('electric (x2)');
      expect(result.weaknesses).toContain('grass (x2)');
      expect(result.resistances.length).toBe(4);
      expect(result.immunities).toEqual([]);
    });

    it('should calculate effectiveness for dual types - fire/flying', () => {
      const fireType: IPokemonType = {
        id: 10,
        name: 'fire',
        damage_relations: {
          double_damage_from: [
            { name: 'water', url: '' },
            { name: 'ground', url: '' },
            { name: 'rock', url: '' },
          ],
          half_damage_from: [
            { name: 'bug', url: '' },
            { name: 'steel', url: '' },
            { name: 'grass', url: '' },
            { name: 'ice', url: '' },
            { name: 'fire', url: '' },
            { name: 'fairy', url: '' },
          ],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const flyingType: IPokemonType = {
        id: 3,
        name: 'flying',
        damage_relations: {
          double_damage_from: [
            { name: 'electric', url: '' },
            { name: 'ice', url: '' },
            { name: 'rock', url: '' },
          ],
          half_damage_from: [
            { name: 'bug', url: '' },
            { name: 'grass', url: '' },
            { name: 'fighting', url: '' },
          ],
          no_damage_from: [{ name: 'ground', url: '' }],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([fireType, flyingType]);
      // Both types are weak to rock (2x + 2x = 4x)
      expect(result.weaknesses).toContain('rock (x4)');
      // Water weak to fireType (x2), not flying - should be in results
      expect(result.weaknesses).toContain('water (x2)');
      // Electric weak to flying only (x2)
      expect(result.weaknesses).toContain('electric (x2)');
      // Ground weak to fireType only (x2) but flying is immune - should cancel out
      expect(result.weaknesses).not.toContain('ground');
      // Bug resistant to both (0.5x * 0.5x = 0.25x)
      expect(result.resistances).toContain('bug (x0.25)');
      // Grass resistant to both (0.5x * 0.5x = 0.25x)
      expect(result.resistances).toContain('grass (x0.25)');
      // Fire resistant to fireType (0.5x) but not flying
      expect(result.resistances).toContain('fire (x0.5)');
      // Ground immune to flying type
      expect(result.immunities).toContain('ground');
    });

    it('should stack weaknesses (2x + 2x = 4x)', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [{ name: 'common', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type2: IPokemonType = {
        id: 2,
        name: 'type2',
        damage_relations: {
          double_damage_from: [{ name: 'common', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1, type2]);
      expect(result.weaknesses).toContain('common (x4)');
    });

    it('should stack resistances (0.5x + 0.5x = 0.25x)', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [{ name: 'common', url: '' }],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type2: IPokemonType = {
        id: 2,
        name: 'type2',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [{ name: 'common', url: '' }],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1, type2]);
      expect(result.resistances).toContain('common (x0.25)');
    });

    it('should cancel weakness and resistance (2x + 0.5x = 1x = neutral)', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [{ name: 'neutral', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type2: IPokemonType = {
        id: 2,
        name: 'type2',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [{ name: 'neutral', url: '' }],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1, type2]);
      expect(result.weaknesses).not.toContain('neutral');
      expect(result.resistances).not.toContain('neutral');
    });

    it('should give immunity priority over other multipliers', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [{ name: 'immune_type', url: '' }],
          half_damage_from: [],
          no_damage_from: [{ name: 'immune_type', url: '' }],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1]);
      expect(result.immunities).toContain('immune_type');
      expect(result.weaknesses).not.toContain('immune_type');
    });

    it('should sort results alphabetically', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [
            { name: 'zebra', url: '' },
            { name: 'apple', url: '' },
            { name: 'monkey', url: '' },
          ],
          half_damage_from: [
            { name: 'zulu', url: '' },
            { name: 'alpha', url: '' },
            { name: 'mike', url: '' },
          ],
          no_damage_from: [
            { name: 'zeta', url: '' },
            { name: 'alpha_immune', url: '' },
            { name: 'mike_immune', url: '' },
          ],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses[0]).toBe('apple (x2)');
      expect(result.resistances[0]).toBe('alpha (x0.5)');
      expect(result.immunities[0]).toBe('alpha_immune');
    });

    it('should handle three types', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [{ name: 'common', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type2: IPokemonType = {
        id: 2,
        name: 'type2',
        damage_relations: {
          double_damage_from: [{ name: 'common', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type3: IPokemonType = {
        id: 3,
        name: 'type3',
        damage_relations: {
          double_damage_from: [{ name: 'common', url: '' }],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1, type2, type3]);
      expect(result.weaknesses).toContain('common (x8)'); // 2 * 2 * 2
    });

    it('should handle complex stacking scenarios', () => {
      const type1: IPokemonType = {
        id: 1,
        name: 'type1',
        damage_relations: {
          double_damage_from: [
            { name: 'typeA', url: '' },
            { name: 'typeB', url: '' },
          ],
          half_damage_from: [{ name: 'typeC', url: '' }],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const type2: IPokemonType = {
        id: 2,
        name: 'type2',
        damage_relations: {
          double_damage_from: [{ name: 'typeA', url: '' }],
          half_damage_from: [
            { name: 'typeB', url: '' },
            { name: 'typeC', url: '' },
          ],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type1, type2]);
      expect(result.weaknesses).toContain('typeA (x4)'); // 2 * 2
      expect(result.weaknesses).not.toContain('typeB'); // 2 * 0.5 = 1
      expect(result.resistances).toContain('typeC (x0.25)'); // 0.5 * 0.5
    });

    it('should return result with correct structure', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [{ name: 'weak', url: '' }],
          half_damage_from: [{ name: 'resist', url: '' }],
          no_damage_from: [{ name: 'immune', url: '' }],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses).toBeDefined();
      expect(result.resistances).toBeDefined();
      expect(result.immunities).toBeDefined();
      expect(Array.isArray(result.weaknesses)).toBe(true);
      expect(Array.isArray(result.resistances)).toBe(true);
      expect(Array.isArray(result.immunities)).toBe(true);
    });

    it('should handle ghost type immunity example', () => {
      const ghostType: IPokemonType = {
        id: 8,
        name: 'ghost',
        damage_relations: {
          double_damage_from: [
            { name: 'ghost', url: '' },
            { name: 'dark', url: '' },
          ],
          half_damage_from: [
            { name: 'poison', url: '' },
            { name: 'bug', url: '' },
          ],
          no_damage_from: [
            { name: 'normal', url: '' },
            { name: 'fighting', url: '' },
          ],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([ghostType]);
      expect(result.immunities).toContain('fighting');
      expect(result.immunities).toContain('normal');
      expect(result.weaknesses).toContain('dark (x2)');
      expect(result.weaknesses).toContain('ghost (x2)');
    });

    it('should handle ground/flying combination with ground immunity', () => {
      const groundType: IPokemonType = {
        id: 5,
        name: 'ground',
        damage_relations: {
          double_damage_from: [
            { name: 'water', url: '' },
            { name: 'grass', url: '' },
            { name: 'ice', url: '' },
          ],
          half_damage_from: [{ name: 'poison', url: '' }],
          no_damage_from: [{ name: 'electric', url: '' }],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const flyingType: IPokemonType = {
        id: 3,
        name: 'flying',
        damage_relations: {
          double_damage_from: [
            { name: 'electric', url: '' },
            { name: 'ice', url: '' },
            { name: 'rock', url: '' },
          ],
          half_damage_from: [
            { name: 'bug', url: '' },
            { name: 'grass', url: '' },
            { name: 'fighting', url: '' },
          ],
          no_damage_from: [{ name: 'ground', url: '' }],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([groundType, flyingType]);
      expect(result.immunities).toContain('electric');
      expect(result.weaknesses).not.toContain('ground');
      expect(result.weaknesses).toContain('water (x2)');
      expect(result.weaknesses).toContain('ice (x4)'); // 2 from both
    });

    it('should handle empty damage relations', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses).toEqual([]);
      expect(result.resistances).toEqual([]);
      expect(result.immunities).toEqual([]);
    });

    it('should handle only weaknesses', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [
            { name: 'weak1', url: '' },
            { name: 'weak2', url: '' },
          ],
          half_damage_from: [],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses.length).toBe(2);
      expect(result.resistances).toEqual([]);
      expect(result.immunities).toEqual([]);
    });

    it('should handle only resistances', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [
            { name: 'resist1', url: '' },
            { name: 'resist2', url: '' },
          ],
          no_damage_from: [],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses).toEqual([]);
      expect(result.resistances.length).toBe(2);
      expect(result.immunities).toEqual([]);
    });

    it('should handle only immunities', () => {
      const type: IPokemonType = {
        id: 1,
        name: 'test',
        damage_relations: {
          double_damage_from: [],
          half_damage_from: [],
          no_damage_from: [
            { name: 'immune1', url: '' },
            { name: 'immune2', url: '' },
          ],
          double_damage_to: [],
          half_damage_to: [],
          no_damage_to: [],
        },
      } as any;

      const result = service.calculateEffectiveness([type]);
      expect(result.weaknesses).toEqual([]);
      expect(result.resistances).toEqual([]);
      expect(result.immunities.length).toBe(2);
    });

    it('should be provided in root', () => {
      const serviceInstance = TestBed.inject(UtilsService);
      expect(serviceInstance).toBeTruthy();
    });
  });
});
