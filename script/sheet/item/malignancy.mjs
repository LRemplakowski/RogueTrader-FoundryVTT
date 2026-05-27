import CharacterItemSheet from "./character-item.mjs";

export default class MalignancySheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "malignancy-sheet",
    classes: ["rogue-trader", "sheet", "malignancy"],
  };

  static METADATA = {
    types: ["malignancy"],
    makeDefault: true,
  }
}
