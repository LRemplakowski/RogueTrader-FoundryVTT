import { RogueTraderItemSheet } from "./item.js";

export class AmmunitionSheet extends RogueTraderItemSheet {
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

  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/ammunition.html"
    }
  };

  activateListeners(html) {
    super.activateListeners(html);
  }
}
