import { EnumBase } from "./enum-base.mjs";

export default class PsyClass extends EnumBase {
    static DEFAULT = "bound";

    static DATA = {
        bound: { label: "PSY_CLASS.BOUND" },
        unbound: { label: "PSY_CLASS.UNBOUND" },
        daemon: { label: "PSY_CLASS.DAEMON" }
    }
}