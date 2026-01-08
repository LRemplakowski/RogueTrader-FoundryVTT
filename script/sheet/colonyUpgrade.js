import { RogueTraderItemSheet } from "./item.js";

export class ColonyUpgradeSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "colony-upgrade-sheet",
    classes: ["rogue-trader", "sheet", "colony-upgrade"],
    position: {
      width: 500,
      height: 400
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/colonyUpgrade.html"
    }
  };
}
