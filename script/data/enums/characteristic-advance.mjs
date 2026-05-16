import { EnumBase } from "./enum-base.mjs";

export default class CharacteristicAdvance extends EnumBase {
	static DEFAULT = "none";

	static DATA = {
		none:         { rating: 0,   label: "ADVANCE.NONE" },
		simple:       { rating: 5,   label: "ADVANCE.SIMPLE" },
		intermediate: { rating: 10,  label: "ADVANCE.INTERMEDIATE" },
		trained:      { rating: 15,  label: "ADVANCE.TRAINED" },
		proficient:   { rating: 20,  label: "ADVANCE.PROFICIENT" },
		expert:       { rating: 25,  label: "ADVANCE.EXPERT" }
	};

	static value(key) {
		return this.DATA[key]?.rating ?? this.DATA[this.DEFAULT].rating;
	}
}
