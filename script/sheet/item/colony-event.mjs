import RogueTraderItemSheet from "./item.mjs";

export default class ColonyEventSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "colony-event-sheet",
    classes: ["rogue-trader", "sheet", "colony-event"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["colonyEvent"],
    makeDefault: true,
  }
}
