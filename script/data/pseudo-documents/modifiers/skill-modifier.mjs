import { CreatureSkill } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import BaseModifier from "./base-modifier.mjs";

export default class SkillModifier extends BaseModifier {
    static metadata() {
        const metadata = super.metadata();
        metadata.documentName = "skillModifier";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.skill = CreatureSkill.schema();
        schema.value = requiredInteger();
        return schema;
    }
}