import CharacterItemModel from "./character-item.mjs";
import { DamageType, HitLocations } from "../enums/_module.mjs"

export default class CriticalInjuryModel extends CharacterItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.category = DamageType.schema();
        schema.part = HitLocations.schema();
        return schema;
    }
}