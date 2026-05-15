import { EnumBase } from "./enum-base.mjs";

export class Craftsmanship extends EnumBase {
  static DEFAULT = "common";

  static DATA = {
    poor: { label: "CRAFTSMANSHIP.POOR" },
    common: { label: "CRAFTSMANSHIP.COMMON" },
    good: { label: "CRAFTSMANSHIP.GOOD" },
    best: { label: "CRAFTSMANSHIP.BEST" }
  };
}
