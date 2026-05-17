import BaseItemModel from "./base-item.mjs";

const { SchemaField, ObjectField } = foundry.data.fields;

export default class CharacterItemModel extends BaseItemModel {
    static metadata() {
        const metadata = super.metadata();
        metadata.embedded.characteristicModifier = "system.modifiers.characteristic";
        metadata.embedded.skillModifier = "system.modifiers.skill";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.modifiers = new SchemaField({
            characteristic: new SchemaField({}),
            skill: new SchemaField({}),
            other: new SchemaField({})
        });
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