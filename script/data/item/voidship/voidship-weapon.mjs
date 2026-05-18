import { ShipFacing, ShipWeaponClass } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import VoidshipItemModel from "./voidship-item.mjs";

export default class VoidshipWeaponModel extends VoidshipItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = ShipWeaponClass.schema();
        schema.strength = requiredInteger({ initial: 1, min: 1});
        schema.damage = new FormulaField();
        schema.critRating = requiredInteger();
        schema.range = requiredInteger();
        schema.side = ShipFacing.schema();
        schema.rof = requiredInteger({ initial: 1, min: 1 })
        return schema;
    }
}