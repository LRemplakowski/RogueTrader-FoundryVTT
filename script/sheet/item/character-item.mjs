import RogueTraderItemSheet from "./item.mjs";

export default class CharacterItemSheet extends RogueTraderItemSheet {
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
}