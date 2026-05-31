import { ValidateSchemaVersion } from "../../../utils/migration.mjs";
import RogueTraderSystemModel from "../system-model.mjs";

const { SchemaField, HTMLField } = foundry.data.fields;

export default class BaseActorModel extends RogueTraderSystemModel {
    static migrateData(source) {
        console.log(source);
        if (source.aptitudes) delete source.aptitudes;
        return super.migrateData(source);
    }

    static defineSchema() {
        const schema = {};
        schema.bio = new SchemaField({
            notes: new HTMLField(),
        });
        return schema;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static LOCALIZATION_PREFIXES = ["ROGUE_TRADER.Actor.base"];

		/** @inheritdoc */
	prepareBaseData() {
		super.prepareBaseData();
	}

	/* -------------------------------------------------- */

	/** @inheritdoc */
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}