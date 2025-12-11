import { Component, inject, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonStore } from '../../../shared/store/pokemon-store.service';
import { PokemonService } from '../../../shared/providers/pokemon.service';

interface PokemonListItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-pokedex',
  imports: [FormsModule, PokemonCardComponent],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent {
  search = signal('');
  store = inject(PokemonStore);
  pokemonService = inject(PokemonService);
  
  pokemonList = signal<PokemonListItem[]>([]);
  filteredList = computed(() => {
    const searchTerm = this.search().toLowerCase().trim();
    if (!searchTerm) return [];
    
    return this.pokemonList()
      .filter(p => p.name.toLowerCase().includes(searchTerm))
      .slice(0, 10); // Limit to 10 suggestions
  });

  constructor() {
    // Load Pokemon list once on component init
    this.pokemonService.getPokemonList().subscribe({
      next: (data) => {
        this.pokemonList.set(data.results);
      },
      error: (err) => console.error('Error loading Pokemon list:', err)
    });
  }

  public searchbar() {
    const trimmedSearch = this.search().trim();
    if (!trimmedSearch) return;
    this.store.fetchPokemon(trimmedSearch);
    this.search.set(''); // Clear search to hide autocomplete list
  }

  public selectPokemon(name: string) {
    this.store.fetchPokemon(name);
    this.search.set(''); // Clear search to hide autocomplete list
  }
}
