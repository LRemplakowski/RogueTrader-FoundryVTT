import RogueTraderItemSheet from "./item.mjs";

export default class ShipWeaponSheet extends RogueTraderItemSheet {
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

  static METADATA = {
    types: ["shipWeapon"],
    makeDefault: true,
  }
}
