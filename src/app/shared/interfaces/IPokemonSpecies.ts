export interface IPokemonSpecies {
    base_happiness: number;
    capture_rate: number;
    color: INamedApiResource;
    egg_groups: INamedApiResource[];
    evolution_chain: IApiResource;
    evolves_from_species: INamedApiResource | null;
    flavor_text_entries: IFlavorTextEntry[];
    form_descriptions: string[];
    forms_switchable: boolean;
    gender_rate: number;
    genera: IGenus[];
    generation: INamedApiResource;
    growth_rate: INamedApiResource;
    habitat: INamedApiResource;
    has_gender_differences: boolean;
    hatch_counter: number;
    id: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    name: string;
    names: IName[];
    order: number;
    pal_park_encounters: IPalParkEncounter[];
    pokedex_numbers: IPokedexNumber[];
    shape: INamedApiResource;
    varieties: IVariety[];
}

interface INamedApiResource {
    name: string;
    url: string;
}

interface IApiResource {
    url: string;
}

interface IFlavorTextEntry {
    flavor_text: string;
    language: INamedApiResource;
    version: INamedApiResource;
}

interface IGenus {
    genus: string;
    language: INamedApiResource;
}

interface IName {
    language: INamedApiResource;
    name: string;
}

interface IPalParkEncounter {
    area: INamedApiResource;
    base_score: number;
    rate: number;
}

interface IPokedexNumber {
    entry_number: number;
    pokedex: INamedApiResource;
}

interface IVariety {
    is_default: boolean;
    pokemon: INamedApiResource;
}