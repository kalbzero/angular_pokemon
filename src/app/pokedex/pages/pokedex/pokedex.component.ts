import { Component, inject, signal, computed, effect, OnDestroy } from '@angular/core';
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

    // Keep autocomplete list width in sync with the input width
    const adjustWidth = () => {
      try {
        if (typeof document === 'undefined') return;
        const input = document.querySelector('.search') as HTMLElement | null;
        const list = document.querySelector('.autocomplete-list') as HTMLElement | null;
        if (input && list) {
          const w = Math.round(input.getBoundingClientRect().width);
          list.style.width = w + 'px';
        }
      } catch (e) {
        // ignore DOM errors in test environment
      }
    };

    // Run whenever filteredList or search changes
    effect(() => {
      // access signals to track
      this.filteredList();
      this.search();
      // schedule adjust after DOM updates
      setTimeout(adjustWidth, 0);
    });

    // Window resize handler
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', adjustWidth);
      this._removeResize = () => window.removeEventListener('resize', adjustWidth);
    }
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

  private _removeResize: (() => void) | null = null;

  ngOnDestroy(): void {
    if (this._removeResize) this._removeResize();
  }
}
