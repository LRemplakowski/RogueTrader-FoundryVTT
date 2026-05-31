import { EnumBase } from "./enum-base.mjs";

export default class CharacteristicAdvance extends EnumBase {
	static DEFAULT = "none";

	static DATA = {
		none:         { rating: 0,   label: "ADVANCE.NONE", short: "N" },
		simple:       { rating: 5,   label: "ADVANCE.SIMPLE", short: "S" },
		intermediate: { rating: 10,  label: "ADVANCE.INTERMEDIATE", short: "I" },
		trained:      { rating: 15,  label: "ADVANCE.TRAINED", short: "T" },
		proficient:   { rating: 20,  label: "ADVANCE.PROFICIENT", short: "P" },
		expert:       { rating: 25,  label: "ADVANCE.EXPERT", short: "E" }
	};

	static value(key) {
		return this.DATA[key]?.rating ?? this.DATA[this.DEFAULT].rating;
	}

	static ratingStringToKey(rating) {
		const keys = CharacteristicAdvance.KEYS;
		if (CharacteristicAdvance.KEYS[rating])
			return rating;
		switch (rating) {
			case 0 :
			case "0": return keys.none;
			case 5:
			case "5": return keys.simple;
			case 10:
			case "10": return keys.intermediate;
			case 15:
			case "15": return keys.trained;
			case 20:
			case "20": return keys.proficient;
			case 25:
			case "25": return keys.expert;
			default: return CharacteristicAdvance.DEFAULT;
		}
	}
}
