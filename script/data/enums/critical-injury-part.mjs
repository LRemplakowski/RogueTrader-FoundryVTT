import { EnumBase } from "./enum-base.mjs";

export class CriticalInjuryPart extends EnumBase {
  static DEFAULT = "head";

  static DATA = {
    head: { label: "ARMOUR.HEAD" },
    leftArm: { label: "ARMOUR.LEFT_ARM" },
    rightArm: { label: "ARMOUR.RIGHT_ARM" },
    body: { label: "ARMOUR.BODY" },
    leftLeg: { label: "ARMOUR.LEFT_LEG" },
    rightLeg: { label: "ARMOUR.RIGHT_LEG" }
  };
}
