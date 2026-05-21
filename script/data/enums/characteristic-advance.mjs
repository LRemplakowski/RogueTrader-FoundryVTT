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
}
