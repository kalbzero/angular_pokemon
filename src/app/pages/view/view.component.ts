import { Component, OnDestroy, OnInit, Version } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { Versions } from 'src/app/interfaces/sprite';
import { Types } from 'src/app/interfaces/types';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  private id_pokemon: string = '';
  public pokemon: Pokemon = {} as Pokemon;
  private unsubscribe$ = new Subject<void>();

  // Auxiliars
  public types_pokemon: string = '';
  public first_generation_founded: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService
  ) { 
    this.id_pokemon = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    if(this.id_pokemon !== '') {
      this.getPokemonByID();
    } 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  /**
   * This function shows how concatenate in a loop and separate the words with ' | '
   * @param types return string with types of pokemon
   */
  private joinTypes(types: Types[]): void {
    if(types.length > 1) {
      types.forEach((t, i) => {
        if(i == 0) {
          this.types_pokemon = t.type.name;
        } else {
          this.types_pokemon += ` | ${t.type.name}`
        }
      })
    } else {
      this.types_pokemon = types[0].type.name;
    }
  }

  private findOutFirstGeneration(versions: Versions): void {
    if (versions['generation-i']['red-blue'].front_default !== null || versions['generation-i'].yellow.front_default !== null) {
      this.first_generation_founded = 'Generation 1';
    } else if (versions['generation-ii'].crystal.front_default !== null || versions['generation-ii'].gold.front_default !== null || versions['generation-ii'].silver.front_default !== null) {
      this.first_generation_founded = 'Generation 2';
    } else if (versions['generation-iii'].emerald.front_default !== null || versions['generation-iii']['firered-leafgreen'].front_default !== null || versions['generation-iii']['ruby-sapphire'].front_default !== null) {
      this.first_generation_founded = 'Generation 3';
    } else if (versions['generation-iv']['diamond-pearl'].front_default !== null || versions['generation-iv']['heartgold-soulsilver'].front_default !== null || versions['generation-iv'].platinum !== null) {
      this.first_generation_founded = 'Generation 4';
    } else if (versions['generation-v']['black-white'].front_default !== null) {
      this.first_generation_founded = 'Generation 5';
    } else if (versions['generation-vi']['omegaruby-alphasapphire'].front_default !== null || versions['generation-vi']['x-y'].front_default !== null) {
      this.first_generation_founded = 'Generation 6';
    } else if (versions['generation-vii']['ultra-sun-ultra-moon'].front_default !== null || versions['generation-vii'].icons.front_default !== null) {
      this.first_generation_founded = 'Generation 7';
    } else if (versions['generation-viii'].icons.front_default !== null) {
      this.first_generation_founded = 'Generation 8';
    }
  }

  private getPokemonByID(): void {
    this.pokeapiService.getPokemonByID(this.id_pokemon)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (pokemon: Pokemon) => {
          this.pokemon = pokemon;
          this.joinTypes(pokemon.types);
          this.findOutFirstGeneration(pokemon.sprites.versions);
        }
      });
  }
}
