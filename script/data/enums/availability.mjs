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
    "very-rare": { label: "AVAILABILITY.VERY_RARE" },
    "extremely-rare": { label: "AVAILABILITY.EXTREMELY_RARE" },
    "near-unique": { label: "AVAILABILITY.NEAR_UNIQUE" },
    unique: { label: "AVAILABILITY.UNIQUE" }
  };
}
