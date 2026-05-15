import { EnumBase } from "./enum-base.mjs";

export class ColonyType extends EnumBase {
  static DEFAULT = "research";

  static DATA = {
    research: { label: "COLONY.TYPE.RESEARCH" },
    mining: { label: "COLONY.TYPE.MINING" },
    ecclesiastical: { label: "COLONY.TYPE.ECCLESIASTICAL" },
    agricultural: { label: "COLONY.TYPE.AGRICULTURAL" },
    pleasure: { label: "COLONY.TYPE.PLEASURE" },
    war: { label: "COLONY.TYPE.WAR" }
  };
}
