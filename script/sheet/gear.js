import { RogueTraderItemSheet } from "./item.js";

export class GearSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "gear-sheet",
    classes: ["rogue-trader", "sheet", "gear"],
    position: {
      width: 500,
      height: 400
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/gear.html"
    }
  };
}
