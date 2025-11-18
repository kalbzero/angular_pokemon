import { Component, input, signal } from '@angular/core';
import { IPokemon } from '../../../shared/interfaces/IPokemon';
import { TitleCasePipe } from '@angular/common';
import { PokemonMoveModalComponent } from '../pokemon-move-modal/pokemon-move-modal.component';

@Component({
  selector: 'pokemon-moves',
  imports: [TitleCasePipe, PokemonMoveModalComponent],
  templateUrl: './pokemon-moves.component.html',
  styleUrl: './pokemon-moves.component.scss',
})
export class PokemonMovesComponent {
  pokemon = input<IPokemon | undefined>();

  public selectedMove = signal<string>('');
  public modalOpen = signal(false);

  openMove(name: string) {
    this.selectedMove.set(name);
    this.modalOpen.set(true);
  }

  onCloseModal() {
    this.modalOpen.set(false);
  }
}
