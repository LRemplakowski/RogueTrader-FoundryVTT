import { EnumBase } from "./enum-base.mjs";

export class SkillAdvance extends EnumBase {
  static DEFAULT = "-20";

  static DATA = {
    "-20": { value: -20, label: "ADVANCE.UNTRAINED" },
    "0":   { value: 0,   label: "ADVANCE.TRAINED" },
    "10":  { value: 10,  label: "ADVANCE.EXPERT" },
    "20":  { value: 20,  label: "ADVANCE.VETERAN" }
  };
}
