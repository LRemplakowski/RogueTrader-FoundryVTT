import { ShipFacing, ShipWeaponClass } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import VoidshipItemModel from "./voidship-item.mjs";

const { StringField } = foundry.data.fields;

export default class VoidshipWeaponModel extends VoidshipItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "shipWeapon",
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = ShipWeaponClass.schema();
        schema.strength = requiredInteger({ initial: 1, min: 1});
        schema.damage = new StringField({ initial: "1d10" });
        schema.critRating = requiredInteger();
        schema.range = requiredInteger();
        schema.side = ShipFacing.schema();
        schema.rof = requiredInteger({ initial: 1, min: 1 })
        return schema;
    }
}