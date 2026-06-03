import { EnumBase } from "./enum-base.mjs";

export default class ShipComponentClass extends EnumBase {
  static DEFAULT = "voidEngine";

  static DATA = Object.freeze({
    voidEngine: { label: "SHIP_ITEM.VOID_ENGINE" },
    warpEngine: { label: "SHIP_ITEM.WARP_ENGINE" },
    gellarField: { label: "SHIP_ITEM.GELLAR_FIELD" },
    voidShield: { label: "SHIP_ITEM.VOID_SHIELD" },
    bridge: { label: "SHIP_ITEM.BRIDGE" },
    lifeSupport: { label: "SHIP_ITEM.LIFE_SUPPORT" },
    crewQuarters: { label: "SHIP_ITEM.CREW_QUARTERS" },
    augurArray: { label: "SHIP_ITEM.AUGUR_ARRAY" },
    supplemental: { label: "SHIP_ITEM.SUPPLEMENTAL" }
  });
}
