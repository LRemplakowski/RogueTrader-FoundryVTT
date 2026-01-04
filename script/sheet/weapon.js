import { RogueTraderItemSheet } from "./item.js";

export class WeaponSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property with tabs configuration
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "weapon"],
    window: {
      resizable: true
    },
    position: {
      width: 600,
      height: 500
    },
    template: "systems/rogue-trader/template/sheet/weapon.html",
    tabs: [
      {
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "stats"
      }
    ]
  };

  // v13 MIGRATION: HandlebarsApplicationMixin requires a template property getter
  get template() {
    return this.options.template;
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
