import { RogueTraderItemSheet } from "./item.js";

export class WeaponSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "weapon-sheet",
    classes: ["rogue-trader", "sheet", "weapon"],
    position: {
      width: 600,
      height: 500
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/weapon.html"
    }
  };
}
