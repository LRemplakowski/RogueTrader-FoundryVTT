import { EnumBase } from "./enum-base.mjs";

export default class PsyClass extends EnumBase {
    static DEFAULT = "bound";

    static DATA = Object.freeze({
        bound: { label: "PSYCHIC_POWER.BOUND" },
        unbound: { label: "PSYCHIC_POWER.UNBOUND" },
        daemon: { label: "PSYCHIC_POWER.DAEMONIC" }
    });
}