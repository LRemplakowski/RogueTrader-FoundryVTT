import { EnumBase } from "./enum-base.mjs";

export default class WeaponClass extends EnumBase {
  static DEFAULT = "melee";

  static DATA = {
    melee: { label: "WEAPON.MELEE" },
    thrown: { label: "WEAPON.THROWN" },
    pistol: { label: "WEAPON.PISTOL" },
    basic: { label: "WEAPON.BASIC" },
    heavy: { label: "WEAPON.HEAVY" },
    launched: { label: "WEAPON.LAUNCHED" },
    placed: { label: "WEAPON.PLACED" },
    vehicle: { label: "WEAPON.VEHICLE" }
  };
}
