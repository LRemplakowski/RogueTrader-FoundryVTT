import { default as BaseActorModel } from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { PsyClass, Characteristics, Skills, SkillAdvance, CharacteristicAdvance, HitLocations } from "../enums/_module.mjs";
import { FormulaField } from "../fields/_module.mjs";
import Utils from "../../common/util.js";
import { EquipmentModel, TalentModel, PsychicPowerModel, ArmourModel, CharacterItemModel } from "../item/character/_module.mjs";
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
        schema.characteristics = new SchemaField(CharacterModel.#defineCharacteristics());
        schema.skills = new SchemaField(CharacterModel.#defineSkills());
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
            rating: requiredInteger(),
            sustained: requiredInteger(),
            class: PsyClass.schema(),
            cost: requiredInteger(),
        });
        return schema;
    }

    static #defineCharacteristics() {
        const definition = {};
        for (const [key, value] of Object.entries(Characteristics.DATA)) {
            definition[key] = this.#characteristicSchema(key, value);
        }
        return definition;
    }

    static #characteristicSchema(key, value) {
        return new SchemaField({
            key: new StringField({blank: false, initial: key, readonly: true, persisted: false}),
            label: new StringField({ blank: false, initial: value.label, readonly: true }),
            short: new StringField({ blank: false, initial: value.short, readonly: true }),
            base: requiredInteger(),
            advance: CharacteristicAdvance.schema(),
            unnatural: new SchemaField({
                base: requiredInteger(),
            }),
            cost: requiredInteger()
        });
    }

    static #defineSkills() {
        const fields = {};
        for (const [skillKey, skillData] of Object.entries(Skills.DATA)) {
            fields[skillKey] = this.#skillSchema(skillKey, skillData);
        }
        return fields;
    }

    static #skillSchema(key, skillData) {
        return new SchemaField({
            key: new StringField({
                blank: false,
                initial: key,
                readonly: true,
                persisted: false,
            }),
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
            group: new StringField({
                initial: skillData.group,
                readonly: true,
                persisted: false,
                blank: false
            }),
            groupLabel: new StringField({
                initial: skillData.groupLabel,
                readonly: true,
                persisted: false,
                blank: false
            }),
            advance: SkillAdvance.schema(),
            cost: requiredInteger({ initial: 0 }),
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.insanity.bonus = Math.floor(this.insanity.value / 10);
        this.#prepareCorruption();
        this.psy.value = this.psy.rating - (this.psy.sustained > 1 ? this.psy.sustained : 0);
        this.#prepareItemBonusDefaults();
    }

    #prepareCorruption() {
        this.corruption.bonus = Math.floor(this.corruption.value / 10);
        let corruptionMultiplier = Math.floor((this.corruption.value - 1) / 30);
        corruptionMultiplier = Math.max(corruptionMultiplier, 0);
        this.corruption.rollModifier = corruptionMultiplier * -10;
    }

    #prepareItemBonusDefaults() {
        const characteristics = foundry.utils.deepClone(this.characteristics ?? {});
        const skills = foundry.utils.deepClone(this.skills ?? {});
        for (const key of Object.keys(characteristics)) {
            characteristics[key].itemBonus = { valueBonus: 0, unnaturalBonus: 0 };
        }
        for (const key of Object.keys(skills)) {
            skills[key].itemBonus = { rollBonus: 0 };
        }
        this.characteristics = characteristics;
        this.skills = skills;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.#prepareItemMaps();
        this.#prepareItemModifiers();
        this.#computeCharacteristicData();
        this.#computeFatigueAndCapCharacteristics();
        this.#computeArmour();
        this.#capAgilityFromArmour();
        this.#computeEncumbrance();
        this.#computeSkillData();
        this.#computeMovement();
        this.#computeExperience();
        this.#computeRank();
    }

    #prepareItemMaps() {
        this.items = {};
        for (const item of this.parent.items) {
            const sys = item.system;
            if (!(sys instanceof CharacterItemModel)) continue;
            const model = sys.constructor;          // e.g. WeaponModel
            const key = model.name                  // "WeaponModel"
                            .replace(/Model$/, "")  // "Weapon"
                            .toLowerCase();         // "weapon"
            if (!this.items[key]) this.items[key] = [];
            this.items[key].push(item);
        }
    }

    #prepareItemModifiers() {
        const characteristics = foundry.utils.deepClone(this.characteristics ?? {});
        const skills = foundry.utils.deepClone(this.skills ?? {});
        for (const item of this.parent.items) {
            const system = item.system;
            if (!(system instanceof CharacterItemModel)) continue;

            // CHARACTERISTIC modifiers
            const charMods = Array.isArray(system.modifiers?.characteristic)
                ? system.modifiers.characteristic
                : (system.modifiers?.characteristic ? Object.values(system.modifiers.characteristic) : []);
            for (const mod of charMods) {
                if (!mod) continue;
                const key = String(mod.characteristic ?? "").trim();
                if (!key) continue;
                if (!Object.prototype.hasOwnProperty.call(characteristics, key)) continue;

                characteristics[key].itemBonus.valueBonus += Number(mod.valueBonus ?? 0);
                characteristics[key].itemBonus.unnaturalBonus += Number(mod.unnaturalBonus ?? 0);
            }

            // SKILL modifiers
            const skillMods = Array.isArray(system.modifiers?.skill)
                ? system.modifiers.skill
                : (system.modifiers?.skill ? Object.values(system.modifiers.skill) : []);
            for (const mod of skillMods) {
                if (!mod) continue;
                const key = String(mod.skill ?? "").trim();
                if (!key) continue;
                if (!Object.prototype.hasOwnProperty.call(skills, key)) continue;

                skills[key].itemBonus.rollBonus += Number(mod.rollBonus ?? 0);
            }
        }
        this.characteristics = characteristics;
        this.skills = skills;
    }

    #computeExperience() {
        this.experience.spentCharacteristics = 0;
        this.experience.spentSkills = 0;
        this.experience.spentTalents = 0;
        this.experience.spentPsychicPowers = 0 + this.psy.cost;
        for (let characteristic of Object.values(this.characteristics)) {
            this.experience.spentCharacteristics += parseInt(characteristic.cost, 10);
        }
        for (let skill of Object.values(this.skills)) {
            this.experience.spentSkills += skill.cost ?? 0;
        }
        for (let item of this.parent.items) {
            if (item.system instanceof TalentModel) {
                this.experience.spentTalents += parseInt(item.system.cost, 10);
            } else if (item.system instanceof PsychicPowerModel) {
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
        const middle = Object.entries(this.characteristics).length / 2;
        for (const [key, char] of Object.entries(this.characteristics)) {
            char.value = char.base + CharacteristicAdvance.value(char.advance) + char.itemBonus.valueBonus;
            char.unnatural.value = char.unnatural.base + char.itemBonus.unnaturalBonus;
            char.unnatural.rollBonus = Math.ceil(char.unnatural.value / 2);
            char.bonus = Utils.getCharacteristicBonus(char.value, char.unnatural.value);
        }
    }

    #computeSkillData() {
        for (const [key, skill] of Object.entries(this.skills)) {
            const skillAdvance = SkillAdvance.DATA[skill.advance];
            skill.isKnown = !skill.isSpecialist || skillAdvance.rating >= 0;
            skill.value = this.characteristics[skill.characteristic].value + skillAdvance.rating;
            skill.byCharacteristic = this.#skillValueByCharacteristic.bind(this, skill);
        }
    }

    /**
     * Private helper that computes the skill value using a different characteristic.
     *
     * @param {object} skill  The skill object
     * @param {string} char   The characteristic key
     * @returns {number}
     */
    #skillValueByCharacteristic(skill, char) {
        const adv = SkillAdvance.DATA[skill.advance].rating;
        return this.characteristics[char].value + adv;
    }

    #computeFatigueAndCapCharacteristics() {
        const tb = this.characteristics.toughness.bonus;
        const wb = this.characteristics.willpower.bonus;
        this.fatigue.max = tb + wb;
        for (const [key, char] of Object.entries(this.characteristics)) {
            const charValue = char.value;
            const charBonus = char.bonus;
            if (charBonus < this.fatigue.max) {
                char.value = Math.ceil(charValue / 2);
                char.bonus = Utils.getCharacteristicBonus(char.value, char.unnatural.value);
            }
        }
    }

    #computeEncumbrance() {
        const sb = this.characteristics.strength.bonus;
        const tb = this.characteristics.toughness.bonus;
        const totalWeight = [...this.parent.items.values()]
                            .filter(item => item.system instanceof EquipmentModel)
                            .reduce((sum, item) => sum + item.system.weight, 0);
        this.encumbrance = {
            max: Utils.getMaxEncumbrance(sb + tb),
            value: totalWeight,
        };
    }

    #computeMovement() { 
        const defaultSize = 4;
        const sizeModifier = this.size - defaultSize;
        const speedBase = this.characteristics.agility.bonus + sizeModifier;
        this.movement = {
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

    #capAgilityFromArmour() {
        let cap = Number.MAX_SAFE_INTEGER;
        if (game.settings.get("rogue-trader", "enableArmourAgilityCap") === false) return;
        for (const location of Object.values(this.armour)) {
            const itemData = location.item?.system;
            if (!(itemData instanceof ArmourModel)) continue;
            if (itemData.maxAgility > 0) {
                cap = itemData.maxAgility < cap ? itemData.maxAgility : cap;
            }
        }
        const agility = this.characteristics.agility;
        if (cap < Number.MAX_SAFE_INTEGER && agility.value > cap) {
            agility.value = cap;
            agility.bonus = Utils.getCharacteristicBonus(agility.value, agility.unnatural.value);
        }
    }

}