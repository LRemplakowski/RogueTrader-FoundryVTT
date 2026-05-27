import RogueTraderItemSheet from "./item.mjs";

export default class PlanetaryResourceSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "planetary-resource-sheet",
    classes: ["rogue-trader", "sheet", "planetary-resource"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["planetaryResource"],
    makeDefault: true,
  }
}