import { default as BaseActorModel } from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { PsyClass, Characteristics, Skills, SkillAdvance, CharacteristicAdvance } from "../enums/_module.mjs";
import { FormulaField } from "../fields/_module.mjs";
import HitLocations from "../enums/hit-locations.mjs";
const Characteristic = Characteristics.DATA;
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

        schema.characteristics = new SchemaField(this.#defineCharacteristics());

        schema.skills = new SchemaField(this.#defineSkills());

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

    static #defineCharacteristics() {
        const definition = {};
        for (const [key, value] of Object.entries(Characteristics.DATA)) {
            definition[key] = this.#characteristicSchema(value);
        }
        return definition;
    }

    static #characteristicSchema(value) {
        return new SchemaField({
            label: new StringField({ blank: false, initial: value.label, readonly: true }),
            short: new StringField({ blank: false, initial: value.short, readonly: true }),
            base: requiredInteger(),
            advance: CharacteristicAdvance.schema(),
            unnatural: requiredInteger(),
            cost: requiredInteger()
        });
    }

    static #defineSkills() {
        const fields = {};
        for (const [skillKey, skillData] of Object.entries(Skills.DATA)) {
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
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.#computeCharacteristicData();
        this.#computeSkillData();
        this.#computeSpeed();
        this.#computeExperience();
        this.#computeRank();
        this.#computeArmour();
    }

    #prepareItemMaps() {

    }

    #computeExperience() {
        this.experience.spentCharacteristics = 0;
        this.experience.spentSkills = 0;
        this.experience.spentTalents = 0;
        this.experience.spentPsychicPowers = this.psy.cost;
        for (let characteristic of Object.values(this.characteristics)) {
            this.experience.spentCharacteristics += parseInt(characteristic.cost, 10);
        }
        for (let skill of Object.values(this.skills)) {
            this.experience.spentSkills = skill.cost;
        }
        for (let item of this.parent.items) {
            if (item.system instanceof TalentDataModel) {
                this.experience.spentTalents += parseInt(item.system.cost, 10);
            } else if (item.system instanceof PsychicPowerDataModel) {
                this.experience.spentPsychicPowers += parseInt(item.system.cost, 10);
            }
        }
        this.experience.totalSpent = 4500
            + this.experience.spentCharacteristics
            + this.experience.spentSkills
            + this.experience.spentTalents
            + this.experience.spentPsychicPowers;
        if (this.experience.value < 5000) {
            this.experience.value = 5000;
        }
        this.experience.remaining = this.experience.value - this.experience.totalSpent;
    }

    #computeRank() {
        const expSpent = this.experience.totalSpent;
        let rank = "";
        if (expSpent < 7000) {
            rank = "1";
        } else if (expSpent < 10000) {
            rank = "2";
        } else if (expSpent < 13000) {
            rank = "3";
        } else if (expSpent < 17000) {
            rank = "4";
        } else if (expSpent < 21000) {
            rank = "5";
        } else if (expSpent < 25000) {
            rank = "6";
        } else if (expSpent < 30000) {
            rank = "7";
        } else if (expSpent < 35000) {
            rank = "8";
        } else {
            rank = "Retired";
        }
        this.bio.rank = rank;
    }

    #computeCharacteristicData() {
        for (const [key, characteristic] of Object.entries(this.characteristics)) {
            characteristic.value = characteristic.base + CharacteristicAdvance.value(characteristic.advance);
            characteristic.bonus = Math.floor(characteristic.value / 10);
        }
    }

    #computeSkillData() {
        for (const [key, skill] of Object.entries(this.skills)) {
            const skillAdvance = SkillAdvance[skill.advance];
            skill.value = Characteristic.value(skill.characteristic) + skillAdvance.rating;
            skill.isKnown = !skill.isSpecialist || skillAdvance.rating >= 0;
        }
    }

    #computeSpeed() { 
        const defaultSize = 4;
        const sizeModifier = this.size - defaultSize;
        const speedBase = this.characteristics.agility.bonus + sizeModifier;
        this.speed = {
            base: speedBase,
            half: speedBase,
            full: speedBase * 2,
            charge: speedBase * 3,
            run: speedBase * 6
        }
    }

    #computeArmour() {
        const locations = Object.keys(HitLocations.DATA);
        const toughnessBonus = this.characteristics.toughness.bonus;
        // 1. Initialize armour structure
        const armour = {};
        for (const loc of locations) {
            armour[loc] = {
                toughnessBonus,
                value: 0,
                total: toughnessBonus,
                item: null,
            };
        }
        // 2. Compute max non-additive armour
        const maxArmour = Object.fromEntries(
            locations.map(loc => [loc, 0])
        );
        for (const item of this.parent.items) {
            const itemData = item.system;
            if (!(itemData instanceof ArmourModel)) continue;
            if (!itemData.isAdditive) continue;

            for (const loc of locations) {
                const armourValue = itemData.part?.[loc] ?? 0;
                if (armourValue > maxArmour[loc]) {
                    maxArmour[loc] = armourValue;
                    armour[loc].item = item;
                }
            }
        }
        // 3. Add additive armour
        for (const item of this.parent.items) {
            const itemData = item.system;
            if (!(itemData instanceof ArmourModel)) continue;
            if (!itemData.isAdditive) continue;

            for (const loc of locations) {
                maxArmour[loc] += item.part?.[loc] ?? 0;
            }
        }
        // 4. Sum total and assign
        for (const loc of locations) {
            armour[loc].value = maxArmour[loc];
            armour[loc].total += maxArmour[loc];
        }
        this.armour = armour;
    }

}