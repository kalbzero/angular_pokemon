interface IApiReference {
    name: string;
    url: string;
}

interface IEvolutionDetail {
    base_form_id: null;
    gender: null;
    held_item: null;
    item: IApiReference | null;
    known_move: null;
    known_move_type: null;
    location: null;
    min_affection: null;
    min_beauty: null;
    min_happiness: number | null;
    min_level: null;
    needs_overworld_rain: boolean;
    party_species: null;
    party_type: null;
    region_id: null;
    relative_physical_stats: null;
    time_of_day: string;
    trade_species: null;
    trigger: IApiReference;
    turn_upside_down: boolean;
}

interface IChainLink {
    evolution_details: IEvolutionDetail[];
    evolves_to: IChainLink[];
    is_baby: boolean;
    species: IApiReference;
}

export interface IPokemonEvolutionChain {
    baby_trigger_item: null;
    chain: IChainLink;
    id: number;
}

export interface EvolutionNode {
  name: string;
  image: string;
  trigger?: string;
  details?: string;
  isParallel?: boolean;
  layoutClass?: string;
  children: EvolutionNode[];
}