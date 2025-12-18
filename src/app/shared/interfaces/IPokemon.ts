export interface IPokemon {
    abilities: PokemonAbility[];
    base_experience: number;
    cries: Cries;
    forms: NamedAPIResource[];
    game_indices: GameIndex[];
    height: number;
    held_items: HeldItem[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: PokemonMove[];
    name: string;
    order: number;
    past_abilities: PastAbilityEntry[];
    past_types: any[];
    species: NamedAPIResource;
    sprites: Sprites;
    stats: PokemonStat[];
    types: PokemonType[];
    weight: number;
}

export interface NamedAPIResource {
    name: string;
    url: string;
}

/* Abilities */
export interface PokemonAbility {
    ability: NamedAPIResource;
    is_hidden: boolean;
    slot: number;
}

/* Cries */
export interface Cries {
    latest: string;
    legacy: string;
}

/* Game indices */
export interface GameIndex {
    game_index: number;
    version: NamedAPIResource;
}

/* Held items */
export interface HeldItem {
    item: NamedAPIResource;
    version_details: HeldItemVersionDetail[];
}

export interface HeldItemVersionDetail {
    rarity: number;
    version: NamedAPIResource;
}

/* Moves */
export interface PokemonMove {
    move: NamedAPIResource;
    version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    order: number | null;
    version_group: NamedAPIResource;
}

/* Past abilities */
export interface PastAbilityEntry {
    abilities: PastAbilitySub[];
    generation: NamedAPIResource;
}

export interface PastAbilitySub {
    ability: NamedAPIResource | null;
    is_hidden: boolean;
    slot: number;
}

/* Sprites (simplificado em partes) */
export interface Sprites {
    back_default?: string | null;
    back_female?: string | null;
    back_shiny?: string | null;
    back_shiny_female?: string | null;
    front_default?: string | null;
    front_female?: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
    other?: SpritesOther;
    versions?: Record<string, any>; // very large and varied structure -> kept generic
}

export interface SpritesOther {
    dream_world?: DreamWorld;
    home?: Home;
    "official-artwork"?: OfficialArtwork;
    showdown?: Record<string, string | null>;
}

export interface DreamWorld {
    front_default: string | null;
    front_female: string | null;
}

export interface Home {
    front_default: string | null;
    front_female: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
}

export interface OfficialArtwork {
    front_default: string | null;
    front_shiny?: string | null;
}

/* Stats */
export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
}

/* Types */
export interface PokemonType {
    slot: number;
    type: NamedAPIResource;
}
