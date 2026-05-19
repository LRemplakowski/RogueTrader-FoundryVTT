import EquipmentModel from "./equipment.mjs";

const { BooleanField } = foundry.data.fields;

export default class CyberneticModel extends EquipmentModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "cybernetic"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.installed = new BooleanField({ initial: false })
        return schema;
    }
}