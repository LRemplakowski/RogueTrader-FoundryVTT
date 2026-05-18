import { BaseItemModel } from "../base-item.mjs";

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
            characteristic: new ObjectField({ initial: {}}),
            skill: new ObjectField({ initial: {}}),
            other: new ObjectField({ initial: {}})
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