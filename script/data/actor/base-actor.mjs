import RogueTraderSystemModel from "../system-model.mjs";

export default class BaseActorModel extends RogueTraderSystemModel {
    static defineSchema() {
        const schema = {};
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