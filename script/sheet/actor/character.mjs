import RogueTraderSheet from "./actor.mjs";

import { Skills, SkillAdvance, Characteristics, CharacteristicAdvance } from "../../data/enums/_module.mjs";

export default class CharacterSheet extends RogueTraderSheet {

    _prepareSkillGroups() {
        const skillData = this.document.system.skills;
        const skills = {
            advanced: {},
        };
        for (const [key, skill] of Object.entries(skillData)) {
            const group = skill.group;
            if (skill.isSpecialist) {
                if (!skills.advanced[group]) {
                    skills.advanced[group] = {
                        entries: {},
                        label: game.i18n.localize(skill.groupLabel)
                    };
                }
                skills.advanced[group].entries[key] = {
                    label: game.i18n.localize(skill.label),
                    total: skill.value,
                    advance: {
                        value: skill.advance,
                        short: SkillAdvance.DATA[skill.advance].short,
                    },
                    isKnown: skill.isKnown,
                    cost: skill.cost,
                };
            }
            else {
                if (!skills.base) {
                    skills.base = {
                        entries: {},
                        label: game.i18n.localize(skill.groupLabel)
                    };
                }
                skills.base.entries[key] = {
                    label: game.i18n.localize(skill.label),
                    total: skill.value,
                    advance: {
                        value: skill.advance,
                        short: SkillAdvance.DATA[skill.advance].short,
                    },
                    cost: skill.cost,
                };
            }
        }
        return skills;
    }

    _prepareCharacteristicGroups() {
        const charData = this.document.system.characteristics;
        const characteristics = {};
        let i = 0;
        const middle = Object.entries(charData).length / 2;
        for (const [key, char] of Object.entries(charData)) {
            characteristics[key] = {
                label: game.i18n.localize(char.label),
                base: char.base,
                total: char.value,
                advance: {
                    value: char.advance,
                    short: CharacteristicAdvance.DATA[char.advance].short
                },
                unnatural: char.unnatural,
                cost: char.cost,
                bonus: char.bonus,
                isLeft: i < middle,
                isRight: i >= middle
            }
            i++;
        }
        return characteristics;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.skills = this._prepareSkillGroups();
        context.characteristics = this._prepareCharacteristicGroups();
        return context;
    }
}