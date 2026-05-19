import { ShipComponentClass } from "../../enums/_module.mjs";
import VoidshipItemModel from "./voidship-item.mjs";

export default class VoidshipComponentModel extends VoidshipItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "shipComponent"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = ShipComponentClass.schema();
        return schema;
    }
}