import EquipmentModel from "./equipment.mjs";

const { StringField } = foundry.data.fields;

export default class GearModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.shortDescription = new StringField({ blank: true, initial: "" })
        return schema;
    }
}