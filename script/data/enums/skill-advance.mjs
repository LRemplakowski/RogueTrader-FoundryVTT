import { EnumBase } from "./enum-base.mjs";

export default class SkillAdvance extends EnumBase {
	static DEFAULT = "untrained";

	static DATA = {
		untrained: 	{ rating: -20, label: "ADVANCE.UNTRAINED", short: "U" },
		trained:   	{ rating: 0,   label: "ADVANCE.TRAINED", short: "T" },
		expert:  	{ rating: 10,  label: "ADVANCE.EXPERT", short: "E" },
		veteran:  	{ rating: 20,  label: "ADVANCE.VETERAN", short: "V" }
	};

	static value(key) {
		return this.DATA[key]?.rating ?? this.DATA[this.DEFAULT].rating;
	}
}
