import { CharacteristicModifier, SkillModifier } from "../../pseudo-documents/_module.mjs";
import { default as BaseItemModel } from "../base-item.mjs";
import { PseudoCollectionField } from "../../fields/_module.mjs";
const { SchemaField, ObjectField, EmbeddedCollectionField } = foundry.data.fields;

export default class CharacterItemModel extends BaseItemModel {
    static get metadata() {
        const metadata = super.metadata;
        metadata.embedded.characteristicModifier = "system.modifiers.characteristic";
        metadata.embedded.skillModifier = "system.modifiers.skill";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.modifiers = new SchemaField({
            characteristic: new PseudoCollectionField(CharacteristicModifier),
            skill: new PseudoCollectionField(SkillModifier),
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