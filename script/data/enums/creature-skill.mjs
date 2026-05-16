import { EnumBase } from "./enum-base.mjs";
import { CreatureCharacteristic } from "./creature-characteristic.mjs";
const { Characteristic } = CreatureCharacteristic.DATA;
export default class CreatureSkill extends EnumBase {
    static DEFAULT = "awareness";

    static DATA = {
        awareness: { 
            label: "SKILL.BASE.AWARENESS", 
            advanced: false,
            group: "base",
            groupLabel: "SKILL.BASE",
            characteristic: CreatureCharacteristic.keyOf(Characteristic.perception)
        },
    }
}