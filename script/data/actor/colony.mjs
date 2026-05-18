import { ColonyType, GovernorType } from "../enums/_module.mjs";
import { ActorReferenceField } from "../fields/_module.mjs";
import { requiredInteger } from "../helpers.mjs";
import BaseActorModel from "./base-actor.mjs";

const { SchemaField, BooleanField, StringField } = foundry.data.fields;

export default class ColonyModel extends BaseActorModel {
    static defineSchema() {
        const schema = super.defineSchema();
        
        schema.governor = new SchemaField({
            id: new ActorReferenceField(),
            governorType: GovernorType.schema(),
            skillBonus: requiredInteger(),
            advancedTraining: new BooleanField(),
        });
        schema.colonyType = ColonyType.schema();
        schema.stats = new SchemaField({
            size: requiredInteger({ initial: 1 }),
            loyalty: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            prosperity: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            security: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            profitFactor: requiredInteger(),
            loyaltyGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            prosperityGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            securityGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            requiredGrowth: requiredInteger(),
            conservativeLastTick: new BooleanField(),
        });
        schema.bio.extendFields({
            starSystem: new StringField({ blank: true, initial: "" }),
            planet: new StringField({ blank: true, initial: "" }),
            foundingDate: new StringField({ blank: true, initial: "" }),
            foundingCost: requiredInteger(),
        });
        schema.development = new SchemaField({
            baseSlots: requiredInteger(),
            slotsTotal: requiredInteger(),
            occupiedSlots: requiredInteger(),
            acquisitionModifier: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
        });

        return schema;
    }
}