import { CharacteristicModifier, SkillModifier } from "../fields/_module.mjs";
import { default as BaseItemModel } from "../base-item.mjs";
import { PseudoCollectionField } from "../../fields/_module.mjs";
const { SchemaField, ObjectField, EmbeddedCollectionField, ArrayField } = foundry.data.fields;

import { ValidateSchemaVersion } from "../../../../utils/migration.mjs";
const Migration = foundry.abstract.Document;
const Properties = foundry.utils;

export default class CharacterItemModel extends BaseItemModel {
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (ValidateSchemaVersion()) return super.migrateData(source);
        if (source.characteristic)
            Properties.deleteProperty(source, `source.characteristic`)
        if (source.skill)
            Properties.deleteProperty(source, `source.skill`)
        if (source.other)
            Properties.deleteProperty(source, `source.other`)
        if (source.modifiers && source.modifiers.characteristic) {
            for (const [key, charMod] of Object.entries(source.modifiers.characteristic)) {
                const propertyPath = `source.modifiers.characteritic.${key}`;
                Migration._addDataFieldMigration(source, `${propertyPath}.id`, `${propertyPath}.propertyKey`);
                Properties.deleteProperty(source, `${propertyPath}.label`);
                Migration._addDataFieldMigration(source, `${propertyPath}.characteristicModifier`, `${propertyPath}.valueBonus`);
                Migration._addDataFieldMigration(source, `${propertyPath}.unnaturalModifier`, `${propertyPath}.unnaturalBonus`);
            }
        }
        if (source.modifiers && source.modifiers.skill) {
            for (const [key, skillMod] of Object.entries(source.modifiers.skill)) {
                const propertyPath = `source.modifiers.skill.${key}`;
                Migration._addDataFieldMigration(source, `${propertyPath}.id`, `${propertyPath}.propertyKey`, CharacterItemModel.#parseSkillModifierKey);
                Properties.deleteProperty(source, `${propertyPath}.label`);
                Migration._addDataFieldMigration(source, `${propertyPath}.skillModifier`, `${propertyPath}.rollBonus`);
            }
        }
        return super.migrateData(source);
    }

    static #parseSkillModifierKey(oldKey) {
        const split = oldKey.split(`:`);
        if (split.length <= 1) return oldKey;
        if (split[0].startsWith(`adv`)) return split[1];
        return oldKey.replace(`:`, `_`);
    }

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