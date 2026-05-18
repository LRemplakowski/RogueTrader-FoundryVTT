import RogueTraderItemSheet from "./item.mjs";

export default class AptitudeSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "aptitude-sheet",
    classes: ["rogue-trader", "sheet", "aptitude"],
    position: {
      width: 500,
      height: 400
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/aptitude.html"
    }
  };
}
