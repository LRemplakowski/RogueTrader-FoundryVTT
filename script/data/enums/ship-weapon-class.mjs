import { EnumBase } from "./enum-base.mjs";

export class ShipWeaponClass extends EnumBase {
  static DEFAULT = "macro";

  static DATA = {
    macro: { label: "SHIP_WEAPON.MACRO" },
    lance: { label: "SHIP_WEAPON.LANCE" },
    torpedo: { label: "SHIP_WEAPON.TORPEDO" },
    hangar: { label: "SHIP_WEAPON.HANGAR" }
  };
}
