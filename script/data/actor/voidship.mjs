import BaseActorModel from "./base-actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import { ActorReferenceField } from "../fields/actor-reference-field.mjs";
import { CrewSkill } from "../enums/crew-skill.mjs";
import { choices } from "yargs";

const { StringField, SchemaField } = foundry.data.fields;

export default class VoidshipModel extends BaseActorModel {

    static defineSchema() {
        return {
            hullClass: new StringField({ blank: true }),
            hullName: new StringField({ blank: true }),
            speed: requiredInteger(),
            manoeuvrability: requiredInteger(),
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
            crewCount: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
            }),
            crewMorale: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
            }),
            crew: new SchemaField({
                count: new SchemaField({
                    max: requiredInteger(),
                    value: requiredInteger(),
                }),
                morale: new SchemaField({
                    max: requiredInteger(),
                    value: requiredInteger(),
                }),
                skill: new StringField({ 
                    blank: false, 
                    default: CrewSkill.DEFAULT, 
                    choices: CrewSkill.schema()
                }),
                namedCrew: new SchemaField({
                    lordCaptain: new ActorReferenceField(),
                    firstOfficer: new ActorReferenceField(),
                    enginseerPrime: new ActorReferenceField(),
                    highFactotum: new ActorReferenceField(),
                    masterArms: new ActorReferenceField(),
                    masterHelmsman: new ActorReferenceField(),
                    masterOrdnance: new ActorReferenceField(),
                    masterEtherics: new ActorReferenceField(),
                    masterChirurgeon: new ActorReferenceField(),
                    masterWhispers: new ActorReferenceField(),
                    masterTelepathica: new ActorReferenceField(),
                    masterWarp: new ActorReferenceField(),
                    confessor: new ActorReferenceField(),
                    drivesmaster: new ActorReferenceField(),
                    congregator: new ActorReferenceField(),
                    bosun: new ActorReferenceField(),
                    infernus: new ActorReferenceField(),
                    twistcatcher: new ActorReferenceField(),
                    voxmaster: new ActorReferenceField(),
                    purser: new ActorReferenceField(),
                    cartographer: new ActorReferenceField(),
                    steward: new ActorReferenceField(),
                }),
            }),
            crewSkill: new StringField({ blank: true }),
            complications: new StringField({ blank: true }),
            pastHistory: new StringField({ blank: true }),
            notes: new StringField({ blank: true }),
        };
    }

  prepareBaseData() {
    super.prepareBaseData();
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    if (!this.parent || this.parent.type !== "ship") return;

    this._computePower();
    this._computeSpace();
    this._computePoints();
    this._computeShipInitiative();
  }

  _computePower() {
    const items = Array.from(this.parent.items ?? []);
    const voidEngine = items.find(item => item.system?.class === "voidEngine");
    const otherItems = items.filter(item => (item.isShipWeapon || item.isShipComponent) && item.system?.class !== "voidEngine");

    this.power.max = voidEngine?.system?.power ?? 0;
    this.power.value = otherItems.reduce((total, item) => total + (item.system?.power || 0), 0);
    this.power.avail = this.power.max - this.power.value;
  }

  _computeSpace() {
    const shipItems = Array.from(this.parent.items ?? []).filter(item => item.isShipWeapon || item.isShipComponent);
    const spaceTaken = shipItems.reduce((total, item) => total + (item.system?.space || 0), 0);
    this.space.value = spaceTaken;
    this.space.avail = this.space.max - spaceTaken;
  }

  _computePoints() {
    const shipItems = Array.from(this.parent.items ?? []).filter(item => item.isShipWeapon || item.isShipComponent);
    const componentsValue = shipItems.reduce((total, item) => total + (item.system?.shipPoints || 0), 0);
    this.points.components = componentsValue;
    this.points.total = componentsValue + this.points.base;
  }

  _computeShipInitiative() {
    if (!this.parent) return;
    this.parent.initiative = {
      base: "1d10",
      bonus: this.detection / 10,
    };
  }
}
