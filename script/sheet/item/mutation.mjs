import CharacterItemSheet from "./character-item.mjs";

export default class MutationSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "mutation-sheet",
    classes: ["rogue-trader", "sheet", "mutation"],
  };

  static METADATA = {
    types: ["mutation"],
    makeDefault: true,
  }
}
