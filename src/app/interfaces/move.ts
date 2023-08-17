import { Generic } from "./generic";
import { Version_group_detail } from "./version_group_detail";

export interface Move {
    move: Generic,
    version_group_details: Version_group_detail[]
}