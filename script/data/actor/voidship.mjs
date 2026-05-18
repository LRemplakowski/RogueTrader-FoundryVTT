import BaseActorModel from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { ActorReferenceField, ItemReferenceField } from "../fields/_module.mjs";
import { CrewSkill, HullClass, ShipComponentClass, ShipFacing } from "../enums/_module.mjs";
import { VoidshipItemModel, VoidshipComponentModel, VoidshipWeaponModel } from "../item/_module.mjs";

const { StringField, SchemaField, HtmlField: HTMLField, NumberField } = foundry.data.fields;

export default class VoidshipModel extends BaseActorModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.bio.extendFields({
            complications: new HTMLField(),
            pastHistory: new HTMLField(),
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
            skill: CrewSkill.schema(),
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
            weaponCapacity: new SchemaField(this.#shipFacings()),
        });
        const componentClass = ShipComponentClass.DATA;
        schema.components = new SchemaField({
            essential: new SchemaField(this.#essentialComponentsSchema()),
        });
        return schema;
    }

    /** Private helper for creating a crew role schema */
    static #crewRole(rank) {
        return new SchemaField({
            id: new ActorReferenceField(),
            rank: new NumberField({
                initial: rank,
                readonly: true,
                persisted: false
            })
        });
    }

    static #essentialComponentsSchema() {
        const essentials = {};
        for (const key of Object.keys(ShipComponentClass.DATA)) {
            if (key === ShipComponentClass.keyOf(ShipComponentClass.DATA.supplemental))
                continue;
            essentials[key] = this.#shipComponent(key);
        }
        return essentials;
    }

    static #shipComponent(category) {
        return new SchemaField({
            id: new ItemReferenceField(),
            class: new StringField({ initial: category, blank: false, readonly: true, persisted: false}),
        });
    }

    static #shipFacings() {
        const facings = {};
        for (const key in Object.keys(ShipFacing.DATA)) {
            facings[key] = requiredInteger();
        }
        return facings;
    }

    prepareBaseData() {
        super.prepareBaseData();
        this.hull.integrity.max = this.hull.integrity.base;
        this.crew.morale.max = this.crew.morale.base;
        this.crew.count.max = this.crew.count.base;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.#prepareVoidshipComponents();
        this.#computePower();
        this.#computeSpace();
        this.#computePoints();
        this.#computeShipInitiative();
    }

    #prepareVoidshipCrew() {
        for (const [key, data] of Object.entries(this.crew.namedCrew)) {
            const actor = game.actors.get(data.id) ?? null;
            this.crew.namedCrew[key].actor = actor;
        }
    }

    #prepareVoidshipComponents() {
        const items = Array.from(this.parent.items ?? []);
        const shipComponents = ShipComponentClass.DATA;
        this.components.supplemental = items.filter(item => 
            item.system instanceof VoidshipComponentModel &&
            ShipComponentClass.compare(shipComponents.supplemental, item.system.class)
        );
        this.components.weapons = items.filter(item => 
            item.system instanceof VoidshipWeaponModel
        );
        const all = []
        for (const [key, data] of Object.entries(this.components.essential)) {
            const item = this.parent?.items?.get(data.id) ?? null;
            this.components.essential[key].item = item;
            if (item !== null)
                all.push(item);
        }
        for (const item of this.components.supplemental) 
            all.push(item);
        for (const item of this.components.weapons)
            all.push(item);
        this.components.all = Array.from(new Set(all.filter(item => item)));
    }

    #computePower() {
        const items = this.components.all;
        const voidEngine = this.components.essential.voidEngine.item;
        this.power.max = voidEngine?.system?.power ?? 0;
        this.power.value = items.filter(item => item !== voidEngine)
                                .reduce((total, item) => total + item.system.power);
        this.power.avail = this.power.max - this.power.value;
    }

    #computeSpace() {
        const shipItems = this.components.all;
        const spaceTaken = shipItems.reduce((total, item) => total + item.system.space);
        this.space.value = spaceTaken;
        this.space.avail = this.space.max - spaceTaken;
    }

    #computePoints() {
        const shipItems = this.components.all;
        const componentsValue = shipItems.reduce((total, item) => total + item.system.shipPoints);
        this.points.components = componentsValue;
        this.points.total = componentsValue + this.points.base;
    }

    #computeShipInitiative() {
        this.initiative = {
            base: "1d10",
            bonus: this.detection / 10,
        };
    }
}
