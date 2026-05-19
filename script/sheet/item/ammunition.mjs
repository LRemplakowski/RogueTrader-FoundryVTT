import RogueTraderItemSheet from "./item.mjs";

export default class AmmunitionSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "ammunition-sheet",
    classes: ["rogue-trader", "sheet", "ammunition"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["ammunition"],
    makeDefault: true,
  }


  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/ammunition.html"
    }
  };
}
