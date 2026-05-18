import ColonyItemModel from "./colony-item.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export default class ColonyEventModel extends ColonyItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.themes = new StringField({ blank: true, initial: "" });
        schema.effect = new HTMLField();
        return schema;
    }
}