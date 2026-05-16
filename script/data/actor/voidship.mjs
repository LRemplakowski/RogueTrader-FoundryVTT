import BaseActorModel from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { ActorReferenceField } from "../fields/actor-reference-field.mjs";
import { CrewSkill, HullClass } from "../enums/_module.mjs";

const { StringField, SchemaField, HtmlField, NumberField } = foundry.data.fields;

export default class VoidshipModel extends BaseActorModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.bio.extendFiels({
            complications: new HtmlField(),
            pastHistory: new HtmlField(),
        });
        schema.crew = new SchemaField({
            count: new SchemaField({
                base: this.#immutableNumberField(100),
                value: requiredInteger(),
            }),
            morale: new SchemaField({
                base: this.#immutableNumberField(100),
                value: requiredInteger(),
            }),
            skill: new StringField({ 
                blank: false, 
                initial: CrewSkill.DEFAULT, 
                choices: CrewSkill.schema()
            }),
            namedCrew: new SchemaField({
                lordCaptain: this.#crewRole(1),
                firstOfficer: this.#crewRole(2),
                enginseerPrime: this.#crewRole(2),
                highFactotum: this.#crewRole(2),
                masterArms: this.#crewRole(3),
                masterHelmsman: this.#crewRole(3),
                masterOrdnance: this.#crewRole(3),
                masterEtherics: this.#crewRole(3),
                masterChirurgeon: this.#crewRole(3),
                masterWhispers: this.#crewRole(3),
                masterTelepathica: this.#crewRole(3),
                masterWarp: this.#crewRole(3),
                confessor: this.#crewRole(4),
                drivesmaster: this.#crewRole(4),
                congregator: this.#crewRole(4),
                bosun: this.#crewRole(4),
                infernus: this.#crewRole(4),
                twistcatcher: this.#crewRole(4),
                voxmaster: this.#crewRole(4),
                purser: this.#crewRole(4),
                cartographer: this.#crewRole(4),
                steward: this.#crewRole(4),
            }),
        });
        schema.hull = new SchemaField({
            class: HullClass.schema(),
            name: new StringField({ blank: true }),
            integrity: new SchemaField({
                base: requiredInteger(),
                value: requiredInteger(),
            }),
        });
        schema.engineering = new SchemaField({
            speed: requiredInteger(),
            maneuverability: requiredInteger(),
            detection: requiredInteger(),
            turretRating: requiredInteger(),
            shields: requiredInteger(),
            armour: requiredInteger(),
            hullIntegrity: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
            }),
            space: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
                avail: requiredInteger(),
            }),
            power: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
                avail: requiredInteger(),
            }),
            points: new SchemaField({
                base: requiredInteger(),
                components: requiredInteger(),
                total: requiredInteger(),
            }),
            weaponCapacity: new SchemaField({
                dorsal: requiredInteger(),
                prow: requiredInteger(),
                keel: requiredInteger(),
                port: requiredInteger(),
                starboard: requiredInteger(),
            }),
        });
        return schema;
    }

    /** Private helper for creating a crew role schema */
    static #crewRole(rank) {
        return new SchemaField({
            actor: new ActorReferenceField(),
            rank: new NumberField({
                initial: rank,
                readonly: true,
                persisted: false
            })
        });
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.hull.integrity.max = this.hull.integrity.base;
        this.crew.morale.max = this.crew.morale.base;
        this.crew.count.max = this.crew.count.base;
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        this.#computePower();
        this.#computeSpace();
        this.#computePoints();
        this.#computeShipInitiative();
    }

    #computePower() {
        const items = Array.from(this.parent.items ?? []);
        const voidEngine = items.find(item => item.system?.class === "voidEngine");
        const otherItems = items.filter(item => (item.isShipWeapon || item.isShipComponent) && item.system?.class !== "voidEngine");

        this.power.max = voidEngine?.system?.power ?? 0;
        this.power.value = otherItems.reduce((total, item) => total + (item.system?.power || 0), 0);
        this.power.avail = this.power.max - this.power.value;
    }

    #computeSpace() {
        const shipItems = Array.from(this.parent.items ?? []).filter(item => item.isShipWeapon || item.isShipComponent);
        const spaceTaken = shipItems.reduce((total, item) => total + (item.system?.space || 0), 0);
        this.space.value = spaceTaken;
        this.space.avail = this.space.max - spaceTaken;
    }

    #computePoints() {
        const shipItems = Array.from(this.parent.items ?? []).filter(item => item.isShipWeapon || item.isShipComponent);
        const componentsValue = shipItems.reduce((total, item) => total + (item.system?.shipPoints || 0), 0);
        this.points.components = componentsValue;
        this.points.total = componentsValue + this.points.base;
    }

    #computeShipInitiative() {
        if (!this.parent) return;
        this.parent.initiative = {
        base: "1d10",
        bonus: this.detection / 10,
        };
    }
}
