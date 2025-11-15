import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';

@Component({
  selector: 'app-pokedex',
  imports: [FormsModule, PokemonCardComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent {
  search = '';
  store = inject(PokemonStore);

  public buscar() {
    if (!this.search.trim()) return;
    this.store.fetchPokemon(this.search);
  }
}
