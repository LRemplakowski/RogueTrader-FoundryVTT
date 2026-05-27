import CharacterItemSheet from "./character-item.mjs";

export default class AptitudeSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "aptitude-sheet",
    classes: ["rogue-trader", "sheet", "aptitude"],
  };

  static METADATA = {
    types: ["aptitude"],
    makeDefault: true,
  }
}
