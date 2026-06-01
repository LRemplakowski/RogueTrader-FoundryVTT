import BaseItemModel from "../base-item.mjs";
import { Availability, Craftsmanship } from "../../enums/_module.mjs"
import { requiredInteger } from "../../helpers.mjs";

const { StringField } = foundry.data.fields;

export default class VoidshipItemModel extends BaseItemModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.craftsmanship = Craftsmanship.schema();
        schema.availability = Availability.schema();
        schema.weight = requiredInteger();
        schema.hullTypes = new StringField();
        schema.power = requiredInteger();
        schema.space = requiredInteger();
        schema.shipPoints = requiredInteger();
        return schema;
    }
}