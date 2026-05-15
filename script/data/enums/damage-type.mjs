import { EnumBase } from "./enum-base.mjs";

export class DamageType extends EnumBase {
  static DEFAULT = "energy";

  static DATA = {
    energy: { label: "DAMAGE_TYPE.ENERGY" },
    impact: { label: "DAMAGE_TYPE.IMPACT" },
    rending: { label: "DAMAGE_TYPE.RENDING" },
    explosive: { label: "DAMAGE_TYPE.EXPLOSIVE" }
  };
}
