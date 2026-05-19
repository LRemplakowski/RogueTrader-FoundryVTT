import { DamageType, PsyZone } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import CharacterItemModel from "./character-item.mjs";

const { StringField, SchemaField, HTMLField } = foundry.data.fields;

export default class PsychicPowerModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "psychicPower"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.shortDescription = new StringField({ blank: true, initial: "" });
        schema.cost = requiredInteger();
        schema.prerequisite = new StringField({ blank: true, initial: "" });
        schema.action = new StringField({ blank: true, initial: "" });
        schema.focusPower = new SchemaField({
            difficulty: requiredInteger(),
            test: new StringField({ blank: true, initial: "" }),
        });
        schema.range = new StringField({ blank: true, initial: "" });
        schema.sustained = new StringField({ blank: true, initial: "No" });
        schema.subtype = new StringField({ blank: true, initial: "" });
        schema.effect = new HTMLField();
        schema.damage = new SchemaField({
            zone: PsyZone.schema(),
            type: DamageType.schema(),
            formula: new FormulaField({ initial: "1d10" }),
            penetration: requiredInteger(),
            special: new StringField({ blank: true, initial: "" }),
        });
        return schema;
    }
}