import CharacterItemSheet from "./character-item.mjs";

export default class PsychicPowerSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "psychic-power-sheet",
    classes: ["rogue-trader", "sheet", "psychic-power"],
  };

  static METADATA = {
    types: ["psychicPower"],
    makeDefault: true,
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.unshift({
      id: "psychic-power-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    },
    {
      id: "psychic-power-effect",
      group: "primary",
      label: "TAB.EFFECT",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-notes"
    });
    tabs.primary.initial = "psychic-power-data";
    return tabs;
  }
}
