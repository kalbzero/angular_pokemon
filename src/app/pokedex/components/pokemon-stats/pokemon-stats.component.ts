import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-stats',
  imports: [TitleCasePipe],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss'
})
export class PokemonStatsComponent {
  @Input() pokemon: IPokemon | undefined;
  private maxBaseStat = 255; // maior valor possível na Pokédex

  public getStatPercent(stat: number): number {
    return Math.round((stat / this.maxBaseStat) * 100);
  }

  public getStatColor(stat: number): string {
    const percent = this.getStatPercent(stat);

    if (percent < 30) return 'var(--stat-bad)'; // fraco
    if (percent < 60) return 'var(--stat-medium)'; // ok
    return 'var(--stat-good)'; // forte
  }
}
