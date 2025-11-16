import { Component, Input, computed, inject, signal } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { PokemonService } from '../../../shared/providers/pokemon.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-info',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.scss'],
})
export class PokemonInfoComponent {
  @Input() pokemon: IPokemon | undefined;

  #pokemonStore = inject(PokemonStore);

  /** species = dados de espécie providos pela API (artwork, flavor text, egg groups etc.) */
  public species = computed(() => this.#pokemonStore.species());

  /** Descrição textual (resumo da Pokédex) */
  public description = computed(() => {
    const sp = this.species();
    if (!sp) return '';

    // Preferir PT -> EN -> fallback
    const pt = sp.flavor_text_entries?.find(
      (f: any) => f.language?.name === 'pt' || f.language?.name === 'pt-BR'
    );
    if (pt) return this.cleanDescription(pt.flavor_text);

    const en = sp.flavor_text_entries?.find(
      (f: any) => f.language?.name === 'en'
    );
    if (en) return this.cleanDescription(en.flavor_text);

    const any = sp.flavor_text_entries?.[0]?.flavor_text;
    return any ? this.cleanDescription(any) : '';
  });

  /** Categoria / Genus do Pokémon */
  public category = computed(() => {
    const sp = this.species();
    if (!sp) return '';

    const pt = sp.genera?.find(
      (g: any) => g.language?.name === 'pt' || g.language?.name === 'pt-BR'
    );
    if (pt) return pt.genus;

    const en = sp.genera?.find((g: any) => g.language?.name === 'en');
    if (en) return en.genus;

    return sp.genera?.[0]?.genus ?? '';
  });

  /** Egg groups */
  public eggGroups = computed(() => {
    return this.species()?.egg_groups?.map((g: any) => g.name) ?? [];
  });

  /** Taxa de captura */
  public captureRate = computed(() => {
    const cap = this.species()?.capture_rate ?? 0;
    return ((cap / 255) * 100).toFixed(2); // retorna 2 casas decimais
  });

  /** Limpa textos com \n, \f, etc */
  private cleanDescription(text: string): string {
    return text
      .replace(/[\n\f\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
