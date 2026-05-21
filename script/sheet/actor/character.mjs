import RogueTraderSheet from "./actor.mjs";

import { Skills, SkillAdvance, Characteristics, CharacteristicAdvance } from "../../data/enums/_module.mjs";

export default class CharacterSheet extends RogueTraderSheet {

    static PARTS = {
        ...super.PARTS,
        tabs: {
            // Foundry-provided generic template
            template: 'templates/generic/tab-navigation.hbs',
            // classes: ['sysclass'], // Optionally add extra classes to the part for extra customization
        },
        stats: {
            template: "systems/rogue-trader/template/sheet/actor/tab/stats.html"
        },
        combat: {
            template: "systems/rogue-trader/template/sheet/actor/tab/combat.html"
        },
        abilities: {
            template: "systems/rogue-trader/template/sheet/actor/tab/abilities.html"
        },
        psychicPowers: {
            template: "systems/rogue-trader/template/sheet/actor/tab/psychic-powers.html"
        },
        gear: {
            template: "systems/rogue-trader/template/sheet/actor/tab/gear.html"
        },
        progression: {
            template: "systems/rogue-trader/template/sheet/actor/tab/progression.html"
        },
        notes: {
            template: "systems/rogue-trader/template/sheet/actor/tab/notes.html"
        }
    }

    static TABS = {
        primary: {
            tabs: [
                {
                    id: "stats",
                    group: "primary",
                    label: "TAB.STATS",
                    icon: "fa-solid fa-chart-bar",
                    cssClass: "tab-stats"
                },
                {
                    id: "combat",
                    group: "primary",
                    label: "TAB.COMBAT",
                    icon: "fa-solid fa-shield",
                    cssClass: "tab-combat"
                },
                {
                    id: "abilities",
                    group: "primary",
                    label: "TAB.ABILITIES",
                    icon: "fa-solid fa-star",
                    cssClass: "tab-abilities"
                },
                {
                    id: "psychic-powers",
                    group: "primary",
                    label: "TAB.PSYCHIC_POWERS",
                    icon: "fa-solid fa-wand-magic-sparkles",
                    cssClass: "tab-psychic-powers"
                },
                {
                    id: "gear",
                    group: "primary",
                    label: "TAB.GEAR",
                    icon: "fa-solid fa-backpack",
                    cssClass: "tab-gear"
                },
                {
                    id: "progression",
                    group: "primary",
                    label: "TAB.ADVANCES",
                    icon: "fa-solid fa-arrow-up",
                    cssClass: "tab-progression"
                },
                {
                    id: "notes",
                    group: "primary",
                    label: "TAB.NOTES",
                    icon: "fa-solid fa-note-sticky",
                    cssClass: "tab-notes"
                }
            ],
            initial: "stats"
        }
    };


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
                unnatural: char.unnatural.value,
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