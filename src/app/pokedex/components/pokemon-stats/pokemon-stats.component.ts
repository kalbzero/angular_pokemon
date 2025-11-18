import { Component, input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-stats',
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss',
})
export class PokemonStatsComponent {
  pokemon = input<IPokemon | undefined>();
  private maxBaseStat = 255; // mmaximum base stat in Pokémon games

  public getStatPercent(stat: number): number {
    return Math.round((stat / this.maxBaseStat) * 100);
  }

  public getStatColor(stat: number): string {
    if (stat < 50) return 'stat-red'; // weak
    if (stat < 90) return 'stat-orange'; // medium
    if (stat < 120) return 'stat-yellow'; // good
    return 'stat-green'; // excellent
  }
}
