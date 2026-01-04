import { RogueTraderItemSheet } from "./item.js";

export class TalentSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property with tabs configuration
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "talent"],
    window: {
      resizable: true
    },
    position: {
      width: 500,
      height: 369
    },
    template: "systems/rogue-trader/template/sheet/talent.html",
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
