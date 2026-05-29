import { CharacteristicModifier, SkillModifier } from "../fields/_module.mjs";
import { default as BaseItemModel } from "../base-item.mjs";
import { PseudoCollectionField } from "../../fields/_module.mjs";
const { SchemaField, ObjectField, EmbeddedCollectionField, ArrayField } = foundry.data.fields;

export default class CharacterItemModel extends BaseItemModel {

    static defineSchema() {
        const schema = super.defineSchema();
        schema.modifiers = new SchemaField({
            characteristic: new ArrayField(CharacteristicModifier.schemaDefinition()),
            skill: new ArrayField(SkillModifier.schemaDefinition()),
            // other: new EmbeddedCollectionField({ initial: []})
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