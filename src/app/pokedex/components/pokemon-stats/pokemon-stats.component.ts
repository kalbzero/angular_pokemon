import { Component, Input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-stats',
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss',
})
export class PokemonStatsComponent {
  @Input() pokemon: IPokemon | undefined;
  private maxBaseStat = 255; // maior valor possível na Pokédex

  public getStatPercent(stat: number): number {
    return Math.round((stat / this.maxBaseStat) * 100);
  }

  public getStatColor(stat: number): string {
    if (stat < 50) return 'stat-red'; // fraco
    if (stat < 90) return 'stat-orange'; // mediano
    if (stat < 120) return 'stat-yellow'; // bom
    return 'stat-green'; // excelente
  }
}
