import { Skills } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";

const { SchemaField } = foundry.data.fields;

export default class SkillModifier {
    static schemaDefinition() { 
        return new SchemaField({
            skill: Skills.schema(),
            rollBonus: requiredInteger(),
        });
    }

    static get DEFAULT_OBJECT() {
        return SkillModifier.schemaDefinition().getInitialValue();
    }
}