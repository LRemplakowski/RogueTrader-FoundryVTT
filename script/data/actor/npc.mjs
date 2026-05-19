import CharacterModel from "./character.mjs";

const { StringField, NumberField } = foundry.data.fields;

export default class NPCModel extends CharacterModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "npc",
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();

        schema.faction = new StringField({ blank: true, initial: "" });
        schema.subfaction = new StringField({ blank: true, initial: "" });
        schema.type = new StringField({ blank: false, initial: "troop" });
        schema.threatLevel = new NumberField({ initial: 0, integer: true });

        return schema;
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}
