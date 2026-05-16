import { BaseActorModel } from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { PsyClass, CreatureCharacteristic, CreatureSkill, SkillAdvance, CharacteristicAdvance } from "../enums/_module.mjs";
import { FormulaField } from "../fields/_module.mjs";
const { Characteristic } = CreatureCharacteristic.DATA;
const {
    StringField,
    SchemaField,
    NumberField,
    BooleanField,
    ArrayField
} = foundry.data.fields;

export default class CharacterModel extends BaseActorModel {
    static defineSchema() {
        const schema = super.defineSchema();

        schema.experience = new SchemaField({
            value: requiredInteger()
        });
        schema.insanity = new SchemaField({
            value: requiredInteger()
        });
        schema.corruption = new SchemaField({
            value: requiredInteger()
        });
        schema.aptitudes = new SchemaField({});
        schema.size = requiredInteger({ initial: 4 });

        schema.characteristics = new SchemaField({
            weaponSkill: this.#characteristic(Characteristic.weaponSkill),
            ballisticSkill: this.#characteristic(Characteristic.ballisticSkill),
            strength: this.#characteristic(Characteristic.strength),
            toughness: this.#characteristic(Characteristic.toughness),
            agility: this.#characteristic(Characteristic.agility),
            intelligence: this.#characteristic(Characteristic.intelligence),
            perception: this.#characteristic(Characteristic.perception),
            willpower: this.#characteristic(Characteristic.willpower),
            fellowship: this.#characteristic(Characteristic.fellowship)
        });

        schema.skills = new SchemaField(this.#skillFieldDefinitions());

        schema.initiative = new SchemaField({
                characteristic: new StringField({ blank: false, initial: "agility" }),
                base: new StringField({ blank: false, initial: "1d10" })
        });

        schema.wounds = new SchemaField({
            max: requiredInteger(),
            value: requiredInteger(),
            critical: requiredInteger()
        });

        schema.fatigue = new SchemaField({
            max: requiredInteger(),
            value: requiredInteger()
        });

        schema.fate = new SchemaField({
            max: requiredInteger(),
            value: requiredInteger()
        });

        schema.psy = new SchemaField({
            psy: new SchemaField({
                rating: requiredInteger(),
                sustained: requiredInteger(),
                class: PsyClass.schema(),
                cost: requiredInteger(),
            })
        });

        return schema;
    }

    static #characteristic(value) {
        return new SchemaField({
            label: new StringField({ blank: false, initial: value.label, readonly: true }),
            short: new StringField({ blank: false, initial: value.short, readonly: true }),
            base: requiredInteger(),
            advance: CharacteristicAdvance.schema(),
            unnatural: requiredInteger(),
            cost: requiredInteger()
        });
    }

    static #skillFieldDefinitions() {
        const fields = {};
        for (const [skillKey, skillData] of Object.entries(CreatureSkill.DATA)) {
            fields[skillKey] = this.#skillSchema(skillData);
        }
        return fields;
    }

    static #skillSchema(skillData) {
        return new SchemaField({
            label: new StringField({ 
                blank: false, 
                initial: skillData.label,
                readonly: true,
                persisted: false
            }),
            characteristic: new StringField({ 
                blank: false, 
                initial: skillData.characteristic, 
                readonly: true, 
                persisted: false 
            }),
            isSpecialist: new BooleanField({ 
                initial: Boolean(skillData.isSpecialist), 
                readonly: true, 
                persisted: false 
            }),
            advance: SkillAdvance.schema(),
            cost: requiredInteger({ initial: 0 }),
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.insanity.bonus = Math.floor(this.insanity.value / 10);
        this.corruption.bonus = Math.floor(this.corruption.value / 10);
        this.#computeCharacteristicData();
        this.#computeSkillData();
        this.speed = this.#getComputedSpeed();
    }

    #computeCharacteristicData() {
        for (const [key, characteristic] of Object.entries(this.characteristics)) {
            characteristic.value = characteristic.base + CharacteristicAdvance.value(characteristic.advance);
            characteristic.bonus = Math.floor(characteristic.value / 10);
        }
    }

    #computeSkillData() {
        for (const [key, skill] of Object.entries(this.skills)) {
            skill.value = Characteristic.value(skill.characteristic) + SkillAdvance.value(skill.advance);
        }
    }

    #getComputedSpeed() {
        const speedBase = this.characteristics.agility.bonus + this.size;
        const speed = {
            half:   speedBase,
            full:   speedBase * 2,
            charge: speedBase * 3,
            run:    speedBase * 6
        }
        return speed;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}