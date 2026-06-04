import { EnumBase } from "./enum-base.mjs";

export default class CrewRoles extends EnumBase {
    static DEFAULT = "lordCaptain";

    static DATA = {
        lrodCaptain: {
            label: "SHIP.NAMED_CREW.LORD_CAPTAIN",
            rank: 1
        }
    }
}