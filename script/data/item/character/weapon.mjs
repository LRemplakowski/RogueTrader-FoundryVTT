import EquipmentModel from "./equipment.mjs";
import { WeaponClass, WeaponType, DamageType } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { ValidateSchemaVersion } from "../../../../utils/migration.mjs";

const { StringField, SchemaField } = foundry.data.fields;

import { ValidateSchemaVersion } from "../../../../utils/migration.mjs";
const Migration = foundry.abstract.Document;
const Properties = foundry.utils;

export default class WeaponModel extends EquipmentModel {
    static migrateData(source) {
        if (!source) return super.migrateData(source);       
        Migration._addDataFieldMigration(source, `damage`, `damage.formula`);
        Migration._addDataFieldMigration(source, `penetration`, `damage.penetration`);
        Migration._addDataFieldMigration(source, `damageType`, `damage.type`);
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "weapon"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = WeaponClass.schema();
        schema.type = WeaponType.schema();
        schema.range = requiredInteger();
        schema.rateOfFire = new SchemaField({
            single: requiredInteger(),
            burst: requiredInteger(),
            full: requiredInteger(),
        });
        schema.damage = new SchemaField({
            formula: new StringField({ blank: false, initial: "1d10" }),
            type: DamageType.schema(),
            penetration: requiredInteger(),
        });
        schema.clip = new SchemaField({
            max: requiredInteger({ initial: 0 }),
            value: requiredInteger({ initial: 0 }),
        });
        schema.reload = new StringField({ blank: true, initial: "" });
        schema.special = new StringField({ blank: true, initial: "" });
        schema.attack = requiredInteger({ initial: 0 });
        return schema;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.characteristic = WeaponClass.DATA[this.class].characteristic;
    }
}