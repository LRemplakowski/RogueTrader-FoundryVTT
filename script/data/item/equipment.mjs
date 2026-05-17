import { Availability, Craftsmanship } from "../enums/_module.mjs";
import { requiredInteger } from "../helpers.mjs";
import CharacterItemModel from "./character-item.mjs";

export default class EquipmentModel extends CharacterItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.craftsmanship = Craftsmanship.schema();
        schema.availability = Availability.schema();
        schema.weight = requiredInteger();
        return schema;
    }

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
    }

    /* -------------------------------------------------- */
}