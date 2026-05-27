import CharacterItemSheet from "./character-item.mjs";

export default class CyberneticSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "cybernetic-sheet",
    classes: ["rogue-trader", "sheet", "cybernetic"],
  };

  static METADATA = {
    types: ["cybernetic"],
    makeDefault: true,
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.unshift({
      id: "cybernetic-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "cybernetic-data";
    return tabs;
  }
}
