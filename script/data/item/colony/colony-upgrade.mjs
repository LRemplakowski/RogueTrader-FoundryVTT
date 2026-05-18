import { requiredInteger } from "../../helpers.mjs";
import { Availability } from "../../enums/_module.mjs";
import ColonyItemModel from "./colony-item.mjs";

const { BooleanField, StringField } = foundry.data.fields;

export default class ColonyUpgradeModel extends ColonyItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.yearlyLoyalty = requiredInteger();
        schema.yearlyProsperity = requiredInteger();
        schema.yearlySecurity = requiredInteger();
        schema.usesUpgradeSlot = new BooleanField({ initial: true });
        schema.bonusSlots = requiredInteger();
        schema.special = new StringField({ blank: true, initial: "" });
        schema.prerequisites = new StringField({ blank: true, initial: "" });
        schema.availability = Availability.schema();
        return schema;
    }
}