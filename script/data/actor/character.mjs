import { BaseActorModel } from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { PsyClass, CreatureCharacteristic } from "../enums/_module.mjs";
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

        schema.skills = new SchemaField({
            advAg: this.#skill("SKILL.ADVANCED-AG", ["Ag"], -20, true, {
                acrobatics: "SKILL.ACROBATICS",
                security: "SKILL.SECURITY",
                shadowing: "SKILL.SHADOWING",
                sleightOfHand: "SKILL.SLEIGHT_OF_HAND"
            }, 0, true),
            advInt: this.#skill("SKILL.ADVANCED-INT", ["Int"], -20, true, {
                chemUse: "SKILL.CHEM-USE",
                demolition: "SKILL.DEMOLITION",
                evaluate: "SKILL.EVALUATE",
                gamble: "SKILL.GAMBLE",
                literacy: "SKILL.LITERACY",
                medicae: "SKILL.MEDICAE",
                survival: "SKILL.SURVIVAL",
                tracking: "SKILL.TRACKING",
                wrangler: "SKILL.WRANGLER"
            }, 0, true),
            advPer: this.#skill("SKILL.ADVANCED-PER", ["Per"], -20, true, {
                psyniscience: "SKILL.PSYNISCIENCE"
            }, 0, true),
            advWP: this.#skill("SKILL.ADVANCED-WP", ["WP"], -20, true, {
                interrogation: "SKILL.INTERROGATION",
                invocation: "SKILL.INVOCATION"
            }, 0, true),
            advFel: this.#skill("SKILL.ADVANCED-FEL", ["Fel"], -20, true, {
                blather: "SKILL.BLATHER",
                charm: "SKILL.CHARM",
                commerce: "SKILL.COMMERCE"
            }, 0, true),
            awareness: this.#skill("SKILL.AWARENESS", ["Per"], -20, false, {}, 0),
            barter: this.#skill("SKILL.BARTER", ["Fel"], -20, false, {}, 0),
            carouse: this.#skill("SKILL.CAROUSE", ["T"], -20, false, {}, 0),
            ciphers: this.#skill("SKILL.CIPHERS", ["Int"], -20, true, {
                rogueTraders: "SKILL.ROGUE-TRADERS",
                mercenaryCant: "SKILL.MERCENARY-CANT",
                nobiliteFamily: "SKILL.NOBILITE-FAMILY",
                astropathSign: "SKILL.ASTROPATH-SIGN",
                underworld: "SKILL.UNDERWORLD"
            }, 0),
            climb: this.#skill("SKILL.CLIMB", ["S"], -20, false, {}, 0),
            command: this.#skill("SKILL.COMMAND", ["Fel", "Int", "S", "WP"], -20, false, {}, 0),
            commonLore: this.#skill("SKILL.COMMON_LORE", ["Int"], -20, true, {
                adeptaSororitas: "SKILL.ADEPTA-SORORITAS",
                adeptusArbites: "SKILL.ADEPTUS-ARBITES",
                adeptusAstartes: "SKILL.ADEPTUS-ASTARTES",
                adeptusAstraTelepathica: "SKILL.ADEPTUS-ASTRATELEPATHICA",
                adeptusMechanicus: "SKILL.ADEPTUS-MECHANICUS",
                administratum: "SKILL.ADMINISTRATUM",
                ecclesiarchy: "SKILL.ECCLESIARCHY",
                imperialCreed: "SKILL.IMPERIAL-CREED",
                imperialGuard: "SKILL.IMPERIAL-GUARD",
                imperialNavy: "SKILL.IMPERIAL-NAVY",
                imperium: "SKILL.IMPERIUM",
                koronousExpanse: "SKILL.KORONOUS-EXPANSE",
                machineCult: "SKILL.MACHINE-CULT",
                navisNobilite: "SKILL.NAVIS-NOBILITE",
                rogueTraders: "SKILL.ROGUE-TRADERS",
                tech: "SKILL.TECH",
                war: "SKILL.WAR",
                underworld: "SKILL.UNDERWORLD"
            }, 0),
            deceive: this.#skill("SKILL.DECEIVE", ["Fel"], -20, false, {}, 0),
            disguise: this.#skill("SKILL.DISGUISE", ["Fel"], -20, false, {}, 0),
            dodge: this.#skill("SKILL.DODGE", ["Ag"], -20, false, {}, 0),
            drive: this.#skill("SKILL.DRIVE", ["Ag"], -20, true, {
                groundVehicle: "SKILL.GROUND-VEHICLE",
                skimmerHover: "SKILL.SKIMMER-HOVER",
                walker: "SKILL.WALKER"
            }, 0),
            forbiddenLore: this.#skill("SKILL.FORBIDDEN_LORE", ["Int"], -20, true, {
                adeptusMechanicus: "SKILL.ADEPTUS-MECHANICUS",
                archaeotech: "SKILL.ARCHAEOTECH",
                daemonology: "SKILL.DAEMONOLOGY",
                heresy: "SKILL.HERESY",
                inquisition: "SKILL.INQUISITION",
                mutants: "SKILL.MUTANTS",
                navigators: "SKILL.NAVIGATORS",
                pirates: "SKILL.PIRATES",
                psykers: "SKILL.PSYKERS",
                theWarp: "SKILL.THE-WARP",
                xenos: "SKILL.XENOS"
            }, 0),
            inquiry: this.#skill("SKILL.INQUIRY", ["Fel"], -20, false, {}, 0),
            intimidate: this.#skill("SKILL.INTIMIDATE", ["S"], -20, false, {}, 0),
            logic: this.#skill("SKILL.LOGIC", ["Int"], -20, false, {}, 0),
            navigate: this.#skill("SKILL.NAVIGATE", ["Int"], -20, true, {
                surface: "SKILL.SURFACE",
                stellar: "SKILL.STELLAR",
                warp: "SKILL.WARP"
            }, 0),
            performer: this.#skill("SKILL.PERFORMER", ["Fel"], -20, true, {
                dancer: "SKILL.DANCER",
                musician: "SKILL.MUSICIAN",
                singer: "SKILL.SINGER",
                storyteller: "SKILL.STORYTELLER"
            }, 0),
            pilot: this.#skill("SKILL.PILOT", ["Ag"], -20, true, {
                personal: "SKILL.PERSONAL",
                flyers: "SKILL.FLYERS",
                spaceCraft: "SKILL.SPACE-CRAFT"
            }, 0),
            scholasticLore: this.#skill("SKILL.SCHOLASTIC_LORE", ["Int"], -20, true, {
                archaic: "SKILL.ARCHAIC",
                astromancy: "SKILL.ASTROMANCY",
                beasts: "SKILL.BEASTS",
                bureaucracy: "SKILL.BUREAUCRACY",
                chymistry: "SKILL.CHYMISTRY",
                cryptology: "SKILL.CRYPTOLOGY",
                heraldry: "SKILL.HERALDRY",
                imperialWarrants: "SKILL.IMPERIAL-WARRANTS",
                imperialCreed: "SKILL.IMPERIAL-CREED",
                judgement: "SKILL.JUDGEMENT",
                legend: "SKILL.LEGEND",
                navisNobilite: "SKILL.NAVIS-NOBILITE",
                numerology: "SKILL.NUMEROLOGY",
                occult: "SKILL.OCCULT",
                philosophy: "SKILL.PHILOSOPHY",
                tacticaImperialis: "SKILL.TACTICA-IMPERIALIS"
            }, 0),
            scrutiny: this.#skill("SKILL.SCRUTINY", ["Per"], -20, false, {}, 0),
            search: this.#skill("SKILL.SEARCH", ["Per"], -20, false, {}, 0),
            secretTongue: this.#skill("SKILL.SECRET-TONGUE", ["Int"], -20, true, {
                administratum: "SKILL.ADMINISTRATUM",
                ecclesiarchy: "SKILL.ECCLESIARCHY",
                military: "SKILL.MILITARY",
                navigators: "SKILL.NAVIGATORS",
                rogueTrader: "SKILL.ROGUE-TRADERS",
                tech: "SKILL.TECH",
                underdeck: "SKILL.UNDERDECK"
            }, 0),
            silentMove: this.#skill("SKILL.SILENT-MOVE", ["Ag"], -20, false, {}, 0),
            speakLanguage: this.#skill("SKILL.SPEAK-LANGUAGE", ["Int"], -20, true, {
                eldar: "SKILL.ELDAR",
                exploratorBinary: "SKILL.EXPLORATOR-BINARY",
                highGothic: "SKILL.HIGH-GOTHIC",
                hiveDialect: "SKILL.HIVE-DIALECT",
                lowGothic: "SKILL.LOW-GOTHIC",
                ork: "SKILL.ORK",
                shipDialect: "SKILL.SHIP-DIALECT",
                technaLingua: "SKILL.TECHNA-LINGUA",
                tradersCant: "SKILL.TRADERS-CANT"
            }, 0),
            swim: this.#skill("SKILL.SWIM", ["S"], -20, false, {}, 0),
            techUse: this.#skill("SKILL.TECH_USE", ["Int"], -20, false, {}, 0),
            trade: this.#skill("SKILL.TRADE", ["Int", "Ag", "Fel"], -20, true, {
                agri: "SKILL.AGRI",
                archaeologist: "SKILL.ARCHAEOLOGIST",
                armourer: "SKILL.ARMOURER",
                astrographer: "SKILL.ASTROGRAPHER",
                chymist: "SKILL.CHYMIST",
                cryptographer: "SKILL.CRYPTOGRAPHER",
                cook: "SKILL.COOK",
                explorator: "SKILL.EXPLORATOR",
                linguist: "SKILL.LINGUIST",
                remembrancer: "SKILL.REMEMBRANCER",
                shipwright: "SKILL.SHIPWRIGHT",
                soothsayer: "SKILL.SOOTHSAYER",
                technomat: "SKILL.TECHNOMAT",
                trader: "SKILL.TRADER",
                voidfarer: "SKILL.VOIDFARER"
            }, 0)
        });

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
            advance: requiredInteger(),
            unnatural: requiredInteger(),
            cost: requiredInteger()
        });
    }

    static #skill(label, characteristics, advance = -20, isSpecialist = false, specialities = {}, cost = 0, preserveAdvanced = false) {
        const fields = {
            label: new StringField({ blank: false, initial: label }),
            characteristics: new ArrayField({ required: true, nullable: false, initial: characteristics }),
            advance: new NumberField({ initial: advance, integer: true }),
            isSpecialist: new BooleanField({ initial: isSpecialist }),
            specialities: this.#specialities(specialities),
            cost: new NumberField({ initial: cost, integer: true })
        };
        if (preserveAdvanced) {
            fields.advanced = new NumberField({ initial: advance, integer: true });
        }
        return new SchemaField(fields);
    }

    static #specialities(definitions = {}) {
        const fields = {};
        for (const [key, label] of Object.entries(definitions)) {
            fields[key] = this.#speciality(label);
        }
        return new SchemaField(fields);
    }

    static #speciality(label) {
        return new SchemaField({
            label: new StringField({ blank: false, initial: label }),
            advance: new NumberField({ initial: -20, integer: true }),
            cost: new NumberField({ initial: 0, integer: true })
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}