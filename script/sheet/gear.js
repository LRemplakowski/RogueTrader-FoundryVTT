import { RogueTraderItemSheet } from "./item.js";

export class GearSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property with tabs configuration
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "gear"],
    window: {
      resizable: true
    },
    position: {
      width: 500,
      height: 400
    },
    template: "systems/rogue-trader/template/sheet/gear.html",
    tabs: [
      {
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "stats"
      }
    ]
  };

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
