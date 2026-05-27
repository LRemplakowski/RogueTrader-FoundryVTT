import CharacterItemSheet from "./character-item.mjs";

export default class AmmunitionSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "ammunition-sheet",
    classes: ["rogue-trader", "sheet", "ammunition"],
  };

  static METADATA = {
    types: ["ammunition"],
    makeDefault: true,
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.unshift({
      id: "ammunition-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "ammunition-data";
    return tabs;
  }
}
