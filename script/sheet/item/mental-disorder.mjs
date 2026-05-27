import CharacterItemSheet from "./character-item.mjs";

export default class MentalDisorderSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "mental-disorder-sheet",
    classes: ["rogue-trader", "sheet", "mental-disorder"],
  };

  static METADATA = {
    types: ["mentalDisorder"],
    makeDefault: true,
  }
}
