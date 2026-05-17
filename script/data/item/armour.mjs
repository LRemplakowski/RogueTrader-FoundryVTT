import { ArmourType, HitLocations } from "../enums/_module.mjs";
import { requiredInteger } from "../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

const { BooleanField, SchemaField } = foundry.data.fields;

export default class ArmourModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.category = ArmourType.schema();
        schema.isAdditive = new BooleanField({ initial: false });
        schema.part = new SchemaField(this.#defineParts());
        schema.maxAgility = requiredInteger();
        return schema;
    }

    static #defineParts() {
        const parts = {};
        for (const key of Object.keys(HitLocations.DATA)) {
            parts[key] = requiredInteger();
        }
        return parts;
    }
}