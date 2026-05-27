import CharacterItemSheet from "./character-item.mjs";

export default class ArmourSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "armour-sheet",
    classes: ["rogue-trader", "sheet", "armour"],
  };

  static METADATA = {
    types: ["armour"],
    makeDefault: true,
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.unshift({
      id: "armour-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "armour-data";
    return tabs;
  }
}
