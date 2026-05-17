import { DamageType } from "../enums/_module.mjs";
import { FormulaField } from "../fields/_module.mjs";
import { requiredInteger } from "../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

export default class AmmunitionModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.damage = new SchemaField({
                modifier: requiredInteger(),
                type: DamageType.schema(),
            }); 
        schema.penetration = requiredInteger();
        schema.attack = requiredInteger();
        schema.special = new StringField({ blank: true, initial: "" });
        schema.weapon = new StringField({ blank: true, initial: ""});
        return schema;
    }
}