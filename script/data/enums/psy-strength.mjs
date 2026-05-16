import { EnumBase } from "./enum-base.mjs";

export default class PsyStrength extends EnumBase {
  static DEFAULT = "fettered";

  static DATA = {
    fettered: { label: "PSY_STRENGTH.FETTERED" },
    unfettered: { label: "PSY_STRENGTH.UNFETTERED" },
    push: { label: "PSY_STRENGTH.PUSH" }
  };
}
