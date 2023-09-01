import { Generic } from "./generic";
import { Version_group_detail } from "./version_group_detail";

export interface Move {
    move: Generic,
    version_group_details: Version_group_detail[],
    vgd_level_learned_at?: string,
    vgd_version_group?: string,
    vgd_move_learn_method?: string,
}

interface Combo {
    use_after: null | Generic[],
    use_before: null | Generic[],

}
interface ContestCombo {
    normal: Combo,
    super: Combo,

}

interface EffectEntries {
    effect: string,
    language: Generic,
    short_effect: string
}

interface FlavorTextEntries {
    flavor_text: string,
    language: Generic,
    version_group: Generic
}

interface Machines {
    machine: { url: string },
    version_group: Generic,

}

interface Meta {
    ailment: Generic,
    ailment_chance: number,
    category: Generic,
    crit_rate: number,
    drain: number,
    flinch_chance: number,
    healing: number,
    max_hits: null | number,
    max_turns: null | number,
    min_hits: null | number,
    min_turns: null | number,
    stat_chance: 0
}

interface PastValues {
    accuracy: number | null,
    effect_chance: null | number,
    effect_entries: [],
    power: null | number,
    pp: null | number,
    type: Generic | null,
    version_group: Generic | null,
}

export interface MoveInfos {
    accuaracy: number | null,
    contest_combos: ContestCombo,
    contest_effect: { url: string },
    contest_type: Generic,
    damage_class: Generic,
    effect_chance: null | number,
    effect_changes: [],
    effect_entries: EffectEntries[],
    flavor_text_entries: FlavorTextEntries[],
    generation: Generic,
    id: number,
    learned_by_pokemon: Generic[],
    machines: Machines[],
    meta: Meta,
    name: string,
    names: { language: Generic, name: string },
    past_values: PastValues[],
    power: number,
    pp: number,
    priority: number,
    stat_changes: [],
    super_contest_effect: Generic,
    target: Generic,
    type: Generic,
}