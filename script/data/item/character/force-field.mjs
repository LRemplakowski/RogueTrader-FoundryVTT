import { requiredInteger } from "../../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

export default class ForceFieldModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.protectionRating = requiredInteger();
        schema.overloadChance = requiredInteger();
        return schema;
    }
}