import { EnumBase } from "./enum-base.mjs";

export class GovernorType extends EnumBase {
  static DEFAULT = "administrative";

  static DATA = {
    administrative: { label: "COLONY.GOV.ADMINISTRATIVE" },
    faithful: { label: "COLONY.GOV.FAITHFUL" },
    lawful: { label: "COLONY.GOV.LAWFUL" },
    accounting: { label: "COLONY.GOV.ACCOUNTING" },
    local: { label: "COLONY.GOV.LOCAL" },
    relaxed: { label: "COLONY.GOV.RELAXED" },
    warlike: { label: "COLONY.GOV.WARLIKE" }
  };
}
