import { EnumBase } from "./enum-base.mjs";

export class HullClass extends EnumBase {
  static DEFAULT = "Transport";

  static DATA = {
    Transport: { label: "HULL_CLASS.TRANSPORT" },
    Raider: { label: "HULL_CLASS.RAIDER" },
    Frigate: { label: "HULL_CLASS.FRIGATE" },
    "Light Cruiser": { label: "HULL_CLASS.LIGHT_CRUISER" },
    Cruiser: { label: "HULL_CLASS.CRUISER" },
    Battlecruiser: { label: "HULL_CLASS.BATTLECRUISER" },
    "Grand Cruiser": { label: "HULL_CLASS.GRAND_CRUISER" },
    Battleship: { label: "HULL_CLASS.BATTLESHIP" }
  };
}
