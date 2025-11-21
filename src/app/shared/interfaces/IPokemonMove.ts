export interface IPokemonMove {
    accuracy: number | null;
    contest_combos: ContestCombos;
    contest_effect: APIResource;
    contest_type: NamedAPIResource;
    damage_class: NamedAPIResource;
    effect_chance: number | null;
    effect_changes: any[];
    effect_entries: EffectEntry[];
    flavor_text_entries: FlavorTextEntry[];
    generation: NamedAPIResource;
    id: number;
    learned_by_pokemon: NamedAPIResource[];
    machines: MachineVersion[];
    meta: MoveMeta;
    name: string;
    names: NameEntry[];
    past_values: any[];
    power: number | null;
    pp: number | null;
    priority: number;
    stat_changes: any[];
    super_contest_effect: APIResource;
    target: NamedAPIResource;
    type: NamedAPIResource;
}

interface NamedAPIResource {
    name: string;
    url: string;
}

interface APIResource {
    url: string;
}

interface ContestCombo {
    use_after: NamedAPIResource[] | null;
    use_before: NamedAPIResource[] | null;
}

interface ContestCombos {
    normal: ContestCombo;
    "super": ContestCombo;
}

interface EffectEntry {
    effect: string;
    language: NamedAPIResource;
    short_effect: string;
}

interface FlavorTextEntry {
    flavor_text: string;
    language: NamedAPIResource;
    version_group: NamedAPIResource;
}

interface MachineVersion {
    machine: APIResource;
    version_group: NamedAPIResource;
}

interface MoveMeta {
    ailment: NamedAPIResource;
    ailment_chance: number;
    category: NamedAPIResource;
    crit_rate: number;
    drain: number;
    flinch_chance: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
    stat_chance: number;
}

interface NameEntry {
    language: NamedAPIResource;
    name: string;
}