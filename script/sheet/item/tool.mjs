import RogueTraderItemSheet from "./item.mjs";

export default class ToolSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "tool-sheet",
    classes: ["rogue-trader", "sheet", "tool"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["tool"],
    makeDefault: true,
  }

  static get TABS() {
    const tabs = super.TABS;
    tabs.primary.tabs.unshift({
      id: "tool-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "tool-data";
    return tabs;
  }
}
