import { requiredInteger } from "../../helpers.mjs";
import BaseModifier from "./base-modifier.mjs";

export default class CharacteristicModifier extends BaseModifier {
    static metadata() {
        const metadata = super.metadata();
        metadata.documentName = "characteristicModifier";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.characteristicBonus = requiredInteger();
        schema.unnaturalBonus = requiredInteger();
        return schema;
    }
}