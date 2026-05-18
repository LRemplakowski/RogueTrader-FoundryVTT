import RogueTraderItemSheet from "./item.mjs";

export default class TalentSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "talent-sheet",
    classes: ["rogue-trader", "sheet", "talent"],
    position: {
      width: 500,
      height: 400
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/talent.html"
    }
  };
}
