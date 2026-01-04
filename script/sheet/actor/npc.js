import { RogueTraderSheet } from "./actor.js";

export class NpcSheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS with configuration
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "npc-sheet",
    classes: ["rogue-trader", "sheet", "actor", "npc"]
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically handles form submission with name="system.*" fields
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/npc.html"
    }
  };

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.document.isOwner) {
      buttons = [].concat(buttons);
    }
    return buttons;
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Enrich biography field
    if (context.system?.bio?.notes) {
      context.system.bio.biographyHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        context.system.bio.notes,
        {
          secrets: context.document.isOwner,
          rollData: context.rollData,
          async: true,
          relativeTo: context.document,
        }
      );
    }
    return context;
  }

  // v13 MIGRATION: appv2 form submission - DocumentSheetV2 handles name="system.*" fields automatically
  // This listener handles custom item cost field submission
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-cost").focusout(async ev => { await this._onItemCostFocusOut(ev); });
  }

  async _onItemCostFocusOut(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    let item = this.document.items.get(div.data("itemId"));
    item.update({"system.cost": $(event.currentTarget)[0].value});
  }
}
