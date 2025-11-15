export interface INamedAPIResource {
    name: string;
    url: string;
}

export interface IDamageRelations {
    double_damage_from: INamedAPIResource[];
    double_damage_to: INamedAPIResource[];
    half_damage_from: INamedAPIResource[];
    half_damage_to: INamedAPIResource[];
    no_damage_from: INamedAPIResource[];
    no_damage_to: INamedAPIResource[];
}

export interface IGameIndex {
    game_index: number;
    generation: INamedAPIResource;
}

export interface ILocalizedName {
    language: INamedAPIResource;
    name: string;
}

export interface IPastDamageRelation {
    damage_relations: IDamageRelations;
    generation: INamedAPIResource;
}

export interface IPokemonSlot {
    pokemon: INamedAPIResource;
    slot: number;
}

/**
 * Sprites structure in the JSON uses generation keys (e.g. "generation-iii")
 * each containing version keys (e.g. "colosseum") which contain an object
 * with a name_icon property. Use index signatures to model this flexible shape.
 */
export interface ISprites {
    [generation: string]: {
        [version: string]: {
            name_icon: string;
        };
    };
}

export interface IPokemonType {
    damage_relations: IDamageRelations;
    game_indices: IGameIndex[];
    generation: INamedAPIResource;
    id: number;
    move_damage_class: INamedAPIResource | null;
    moves: INamedAPIResource[];
    name: string;
    names: ILocalizedName[];
    past_damage_relations: IPastDamageRelation[];
    pokemon: IPokemonSlot[];
    sprites: ISprites;
}
