import RogueTraderSystemModel from "../system-model.mjs";

export default class BaseActorModel extends RogueTraderSystemModel {
    static defineSchema() {
        const schema = {};
        schema.bio = new SchemaField({
            notes: new HtmlField(),
        });
        return schema;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static LOCALIZATION_PREFIXES = ["ROGUE_TRADER.Actor.base"];

    /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }
}