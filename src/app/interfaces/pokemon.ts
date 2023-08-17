import { Ability } from "./ability";
import { Game_index } from "./game_index";
import { Generic } from "./generic";
import { Item } from "./item";
import { Move } from "./move";
import { Past_types } from "./past_types";
import { Sprite } from "./sprite";
import { Stats } from "./stats";
import { Types } from "./types";

export interface Pokemon {
    id: number,
    name: string,
    base_experience: number,
    height: number,
    height_converted?: string,
    is_default: boolean,
    order: number,
    weight: number,
    weight_converted?: string,
    abilities: Ability[],
    forms: Generic[],
    game_indices: Game_index[],
    held_items: Item[],
    location_area_encounters: string,
    moves: Move[],
    species: Generic,
    sprites: Sprite,
    stats: Stats[],
    types: Types[],
    past_types: Past_types[]
}

export interface PokemonList {
    count: number,
    next: string | null,
    previous: string | null,
    results: Generic[]
} 