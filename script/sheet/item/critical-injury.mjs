import RogueTraderItemSheet from "./item.mjs";

export default class CriticalInjurySheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "critical-injury-sheet",
    classes: ["rogue-trader", "sheet", "critical-injury"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["criticalInjury"],
    makeDefault: true,
  }


  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/critical-injury.html"
    }
  };
}
