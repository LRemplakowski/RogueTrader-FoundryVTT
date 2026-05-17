import { EnumBase } from "./enum-base.mjs";

export default class HitLocations extends EnumBase {
    static DEFAULT = "body"

    static DATA = {
        head: { },
        body: { },
        leftArm: { },
        rightArm: { },
        leftLeg: { },
        rightLeg: { }
    }
}