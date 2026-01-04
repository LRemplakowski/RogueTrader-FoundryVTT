import { RogueTraderItemSheet } from "./item.js";

export class ColonyEventSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS with template definition
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "colony-event"],
    window: {
      resizable: true
    },
    position: {
      width: 500,
      height: 500
    },
    template: "systems/rogue-trader/template/sheet/colony-event.html"
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

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.effectHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.effect,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    return context;
  }
}
