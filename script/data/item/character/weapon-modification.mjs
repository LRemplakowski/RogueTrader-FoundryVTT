import EquipmentModel from "./equipment.mjs";

const { StringField, BooleanField } = foundry.data.fields;

export default class WeaponModificationModel extends EquipmentModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.upgrades = new StringField({ blank: true, initial: "" });
        schema.installed = new BooleanField({ initial: false });
        return schema;
    }
}