import {
  Component,
  signal,
  inject,
  computed,
  input,
  output,
  model,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { PokemonService } from '../../../shared/providers/pokemon.service';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { IPokemonMove } from '../../../shared/interfaces/IPokemonMove';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';

@Component({
  selector: 'pokemon-move-modal',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, TooltipComponent],
  templateUrl: './pokemon-move-modal.component.html',
  styleUrl: './pokemon-move-modal.component.scss',
})
export class PokemonMoveModalComponent {
  public moveName = input.required<string>();
  public visible = model<boolean>(false);
  public closeModal = output<void>();

  #pokemonService = inject(PokemonService);
  #pokemonStore = inject(PokemonStore);

  public move = signal<IPokemonMove | null>(null);

  public damageInfo = computed(() => {
    const move = this.move();
    const pokemon = this.#pokemonStore.pokemon();
    const typeData = this.#pokemonStore.typeData();

    if (!move || !pokemon || !typeData) return null;

    const base = move.power ?? 0;

    // STAB
    const hasSTAB = pokemon.types.some(
      (t: any) => t.type.name === move.type.name
    );
    const stab = hasSTAB ? 1.5 : 1;

    // Efetividade do tipo do move no alvo
    const eff =
      typeData.effectiveness?.[move.type.name] !== undefined
        ? typeData.effectiveness![move.type.name]
        : 1;

    const finalDamage = Math.round(base * stab * eff);

    return {
      base,
      stab,
      effectiveness: eff,
      finalDamage,
    };
  });

  ngOnChanges(): void {
    if (this.visible() && this.moveName()) {
      this.#pokemonService
        .getPokemonMove(this.moveName())
        .subscribe((res: any) => {
          this.move.set(res);
        });
    }
  }

  public description = computed(() => {
    const m = this.move();
    if (!m) return '';

    const en = m.effect_entries?.find((e: any) => e.language.name === 'en');
    return en?.short_effect ?? 'No description.';
  });

  close() {
    this.visible.set(false);
    this.closeModal.emit();
  }
}
