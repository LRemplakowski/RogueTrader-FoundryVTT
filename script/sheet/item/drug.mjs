import RogueTraderItemSheet from "./item.mjs";

export default class DrugSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "drug-sheet",
    classes: ["rogue-trader", "sheet", "drug"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["drug"],
    makeDefault: true,
  }


  // v13 MIGRATION: PARTS defines the template structure
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/drug.html"
    }
  };
}
