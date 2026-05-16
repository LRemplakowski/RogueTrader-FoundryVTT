import { EnumBase } from "./enum-base.mjs";

export default class Availability extends EnumBase {
  static DEFAULT = "common";

  static DATA = {
    ubiquitous: { label: "AVAILABILITY.UBIQUITOUS" },
    abundant: { label: "AVAILABILITY.ABUNDANT" },
    plentiful: { label: "AVAILABILITY.PLENTIFUL" },
    common: { label: "AVAILABILITY.COMMON" },
    average: { label: "AVAILABILITY.AVERAGE" },
    scarce: { label: "AVAILABILITY.SCARCE" },
    rare: { label: "AVAILABILITY.RARE" },
    veryRare: { label: "AVAILABILITY.VERY_RARE" },
    extremelyRare: { label: "AVAILABILITY.EXTREMELY_RARE" },
    nearUnique: { label: "AVAILABILITY.NEAR_UNIQUE" },
    unique: { label: "AVAILABILITY.UNIQUE" }
  };
}
