import { RogueTraderItemSheet } from "./item.js";

export class ShipWeaponSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "ship-weapon-sheet",
    classes: ["rogue-trader", "sheet", "ship-weapon"],
    position: {
      width: 500,
      height: 400
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/shipWeapon.html"
    }
  };

  activateListeners(html) {
    super.activateListeners(html);
  }
}
