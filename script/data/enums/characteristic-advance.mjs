import { EnumBase } from "./enum-base.mjs";

export class CharacteristicAdvance extends EnumBase {
  static DEFAULT = "0";

  static DATA = {
    "0":  { value: 0,  label: "ADVANCE.NONE" },
    "5":  { value: 5,  label: "ADVANCE.SIMPLE" },
    "10": { value: 10, label: "ADVANCE.INTERMEDIATE" },
    "15": { value: 15, label: "ADVANCE.TRAINED" },
    "20": { value: 20, label: "ADVANCE.PROFICIENT" },
    "25": { value: 25, label: "ADVANCE.EXPERT" }
  };
}
