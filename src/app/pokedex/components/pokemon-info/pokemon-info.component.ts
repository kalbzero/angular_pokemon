import { Component, computed, inject, input } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'pokemon-info',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.scss'],
})
export class PokemonInfoComponent {
  pokemon = input<IPokemon | undefined>();

  #pokemonStore = inject(PokemonStore);

  public species = computed(() => this.#pokemonStore.species());

  public description = computed(() => {
    const sp = this.species();
    if (!sp) return '';

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

  public eggGroups = computed(() => {
    return this.species()?.egg_groups?.map((g: any) => g.name) ?? [];
  });

  public captureRate = computed(() => {
    const cap = this.species()?.capture_rate ?? 0;
    return ((cap / 255) * 100).toFixed(2);
  });

  private cleanDescription(text: string): string {
    return text
      .replace(/[\n\f\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
