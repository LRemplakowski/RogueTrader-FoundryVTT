import { Availability, Craftsmanship } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import CharacterItemModel from "./character-item.mjs";

import { ValidateSchemaVersion } from "../../../../utils/migration.mjs";
const Migration = foundry.abstract.Document;
const Properties = foundry.utils;

export default class EquipmentModel extends CharacterItemModel {
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (ValidateSchemaVersion()) return super.migrateData(source);
        if (source.availability) {
            Properties.setProperty(source, `availability`, Availability.tryParseLegacyValue(source.availability));
        }
        return super.migrateData(source);
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.craftsmanship = Craftsmanship.schema();
        schema.availability = Availability.schema();
        schema.weight = requiredInteger();
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