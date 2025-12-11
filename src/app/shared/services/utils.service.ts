import { Injectable } from '@angular/core';
import { IPokemonType } from '../interfaces/IPokemonType';
import { IPokemonTypeRelations } from '../interfaces/IPokemonTypeRelations';

@Injectable({
  providedIn: 'root',
})
export class UtilsService { 
  /**
   * Calcula fraquezas, resistências e imunidades
   * combinando 1 ou 2 tipos simultaneamente.
   */
  calculateEffectiveness(typeResponses: IPokemonType[]): IPokemonTypeRelations {
    const damageMap: Record<string, number> = {};

    typeResponses.forEach((type) => {
      const relations = type.damage_relations;

      // Fraqueza: toma 2x
      relations.double_damage_from.forEach((t) => {
        this.addMultiplier(damageMap, t.name, 2);
      });

      // Resistência: toma 0.5x
      relations.half_damage_from.forEach((t) => {
        this.addMultiplier(damageMap, t.name, 0.5);
      });

      // Imunidade: toma 0x
      relations.no_damage_from.forEach((t) => {
        damageMap[t.name] = 0;
      });
    });

    // Converte o mapa para listas amigáveis
    const weaknesses: string[] = [];
    const resistances: string[] = [];
    const immunities: string[] = [];

    for (const [type, value] of Object.entries(damageMap)) {
      if (value === 0) {
        immunities.push(type);
      } else if (value > 1) {
        // inclui x4, x2, x1.5...
        weaknesses.push(`${type} (x${value})`);
      } else if (value < 1) {
        // inclui x0.5, x0.25
        resistances.push(`${type} (x${value})`);
      }
    }

    return {
      weaknesses: weaknesses.sort(),
      resistances: resistances.sort(),
      immunities: immunities.sort(),
    };
  }

  /**
   * Soma multiplicadores seguindo regra de Pokémon:
   *  - Type1 fraco (2x) + Type2 fraco (2x) = 4x
   *  - Type1 fraco (2x) + Type2 resiste (0.5x) = 1x → neutro
   *  - Type1 imune (0x) sempre prevalece
   */
  private addMultiplier(
    map: Record<string, number>,
    type: string,
    multiplier: number
  ) {
    if (map[type] === 0) return; // imunidade é absoluta

    if (!map[type]) {
      map[type] = multiplier;
    } else {
      map[type] *= multiplier;

      // Se multiplicação resultar exatamente em 1, remove como neutro
      if (map[type] === 1) {
        delete map[type];
      }
    }
  }
}
