import { StringField } from "foundry/data/fields.js";

export class EnumBase {
  /** Override in subclass */
  static DATA = {};

  /** Override in subclass */
  static DEFAULT = "";

  /** Schema: keys only, no localization, no metadata */
  static schema() {
    return new StringField({
      initial: this.DEFAULT,
      choices: () =>
        Object.fromEntries(
          Object.keys(this.DATA).map(key => [key, key])
        )
    });
  }

  /** UI: localized labels + metadata */
  static choices() {
    return Object.fromEntries(
      Object.entries(this.DATA).map(([key, data]) => [
        key,
        {
          label: game.i18n.localize(data.label),
          ...data
        }
      ])
    );
  }

  /** Numeric or other primary value lookup */
  static value(key) {
    return this.DATA[key]?.rating ?? null;
  }

  /** Localized label lookup */
  static label(key) {
    const entry = this.DATA[key];
    return entry ? game.i18n.localize(entry.label) : key;
  }
}
