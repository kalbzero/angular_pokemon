import { Generic } from "./generic";
import { Version_detail } from "./version_detail";

export interface Item {
    item: Generic,
    version_details: Version_detail[]
}