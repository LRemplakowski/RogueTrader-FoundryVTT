import { DamageType } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

const { SchemaField, StringField } = foundry.data.fields;

export default class AmmunitionModel extends EquipmentModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "ammunition"
        };
    }

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
        schema.quantity = requiredInteger();
        return schema;
    }
}