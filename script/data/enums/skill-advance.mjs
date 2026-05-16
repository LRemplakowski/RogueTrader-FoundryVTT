import { EnumBase } from "./enum-base.mjs";

export default class SkillAdvance extends EnumBase {
	static DEFAULT = "untrained";

	static DATA = {
		untrained: 	{ rating: -20, label: "ADVANCE.UNTRAINED" },
		trained:   	{ rating: 0,   label: "ADVANCE.TRAINED" },
		expert:  	{ rating: 10,  label: "ADVANCE.EXPERT" },
		veteran:  	{ rating: 20,  label: "ADVANCE.VETERAN" }
	};

	static value(key) {
		return this.DATA[key]?.rating ?? this.DATA[this.DEFAULT].rating;
	}
}
