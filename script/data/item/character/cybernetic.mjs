import EquipmentModel from "./equipment.mjs";

const { BooleanField } = foundry.data.fields;

export default class CyberneticModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.installed = new BooleanField({ initial: false })
        return schema;
    }
}