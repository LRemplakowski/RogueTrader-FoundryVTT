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

	static ratingStringToKey(rating) {
		const keys = SkillAdvance.KEYS;
		if (SkillAdvance.KEYS[rating])
			return rating;
		switch (rating) {
			case -20:
			case "-20": return keys.untrained;
			case 0:
			case "0": return keys.trained;
			case 10:
			case "10": return keys.expert;
			case 20:
			case "20": return keys.veteran;
			default: return SkillAdvance.DEFAULT;
		}
	}
}
