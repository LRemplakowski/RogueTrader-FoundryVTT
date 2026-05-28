import RogueTraderItemSheet from "./item.mjs";
import * as pseudo from "../../data/pseudo-documents/_module.mjs";

export default class CharacterItemSheet extends RogueTraderItemSheet {

  static get DEFAULT_OPTIONS() {
    const options = super.DEFAULT_OPTIONS;
    options.actions ??= {};
		options.actions.addModifier = CharacterItemSheet.#addModifier;
    options.actions.deleteModifier = CharacterItemSheet.#deleteModifier;
		return options;
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.push({
      id: "modifiers",
      group: "primary",
      label: "TAB.MODIFIERS",
      icon: "fa-solid fa-star",
      cssClass: "tab-abilities"
		});
    return tabs;
  }

  /**
	 * Handle adding a characteristic modifier.
	 * @this {CharacterItemSheet}
	 * @param {PointerEvent} event
	 * @param {HTMLElement} target
	 */
	static async #addModifier(event, target) {
		event.preventDefault();
		const className = target.dataset.class;
    console.log(pseudo);
    console.log(className);
    const ModifierClass = pseudo[className];
    if (!ModifierClass) {
      ui.notifications.error(`Unknown pseudodocument class: ${className}`);
      return;
    }

    await ModifierClass.create({}, { parent: this.document });

    this.render();
	}

	/**
	 * Handle deleting a modifier.
	 * @this {CharacterItemSheet}
	 * @param {PointerEvent} event
	 * @param {HTMLElement} target
	 */
	static async #deleteModifier(event, target) {
		event.preventDefault();
		const div = target.closest(".modifier-item");
		const modId = div.dataset.modifierId;
		const modKey = div.dataset.modifierKey;
		const itemData = this.document.system;
		delete itemData.modifiers[modId][modKey];
		await this.document.update({ [`system.modifiers.${modId}.-=${modKey}`]: null });
		console.log(`Modifier removed: ${modId} - ${modKey}`);
	}

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.modifiers ??= {};
    console.log(this.document);
    context.modifiers.characteristic = this.document.system.modifiers.characteristic.contents;
    context.modifiers.skill = this.document.system.modifiers.skill.contents;
    console.log(context);
    return context;
  }
}