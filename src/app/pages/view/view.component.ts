import { Component, OnDestroy, OnInit, Version, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { Sprite, Versions } from 'src/app/interfaces/sprite';
import { Types } from 'src/app/interfaces/types';
import { PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  private id_pokemon: string = '';
  public pokemon: Pokemon = {
        sprites: {
          back_default: '',
          back_female: '',
          back_shiny: '',
          back_shiny_female: '',
          front_default: '',
          front_female: '',
          front_shiny: '',
          front_shiny_female: '',
          other: {
            dream_world: {
              front_default: '',
              front_female: ''
            },
            home: {
              front_default: '',
              front_female: '',
              front_shiny: '',
              front_shiny_female: ''
            },
            'official-artwork': {
              front_default: '',
              front_shiny: ''
            }
          }
        }     
  } as Pokemon;
  private unsubscribe$ = new Subject<void>();
  @ViewChild('dt1') dt1: Table = {} as Table;

  // Auxiliars
  public types_pokemon: string = '';
  public first_generation_founded: string = '';
  public official_artwork_default: string = '';
  public official_artwork_shiny: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService
  ) {
    this.id_pokemon = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id_pokemon !== '') {
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
    if (types.length > 1) {
      types.forEach((t, i) => {
        if (i == 0) {
          this.types_pokemon = `<span class="${t.type.name}">${t.type.name}</span>`
        } else {
          this.types_pokemon += ` | <span class="${t.type.name}">${t.type.name}</span>`
        }
      })
    } else {
      this.types_pokemon = `<span class="${types[0].type.name}">${types[0].type.name}</span>`;
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

  private convertHeight(height: number): string {
    const meters = height / 10; // Coverting to meters
    const feet = Math.floor(meters * 3.281); // converting to feet (1 meter = 3.281 feet)
    const inches = Math.round((meters * 3.281 - feet) * 12); // Converting to inches

    return `${meters.toFixed(1)}m (${feet}'${inches}")`;
  }

  private convertWeight(weight: number) {
    const kg = weight / 10; // Coverting to Kg
    const lbs = Math.round(kg * 2.20462); // Coverting to lbs (1 kg = 2.20462 lbs)

    return `${kg.toFixed(1)} kg (${lbs.toFixed(1)} lbs)`
  }

  private getPokemonByID(): void {
    this.pokeapiService.getPokemonByID(this.id_pokemon)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (pokemon: Pokemon) => {
          this.pokemon = pokemon;
          this.joinTypes(pokemon.types);
          this.findOutFirstGeneration(pokemon.sprites.versions);
          pokemon.height_converted = this.convertHeight(pokemon.height);
          pokemon.weight_converted = this.convertWeight(pokemon.weight);
          pokemon.moves.forEach(move => {
            move.vgd_level_learned_at = '';
            move.vgd_move_learn_method = '';
            move.vgd_version_group = '';
            move.version_group_details.forEach(vgd => {
              move.vgd_version_group += `${vgd.version_group.name} `;
              move.vgd_level_learned_at += `${vgd.level_learned_at} `;
              move.vgd_move_learn_method += `${vgd.move_learn_method.name} `;
            })
          })
          this.official_artwork_default = pokemon.sprites.other['official-artwork'].front_default || 'assets/img/pokeball.png';
          this.official_artwork_shiny = pokemon.sprites.other['official-artwork'].front_shiny || 'assets/img/pokeball.png';
        }
      });
  }

  public filterMoves(event: any): void {
    console.log(event.target.value);
    this.dt1.filterGlobal(event.target.value, 'contains');
  }

}
