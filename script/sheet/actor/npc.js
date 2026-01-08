import { RogueTraderSheet } from "./actor.js";

export class NpcSheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS with configuration
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "npc-sheet",
    classes: ["rogue-trader", "sheet", "actor", "npc"],
    actions: {
      itemCostFocusOut: NpcSheet.#itemCostFocusOut
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically handles form submission with name="system.*" fields
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/npc.html"
    }
  };

  /**
   * Handle item cost focus out.
   * @this {NpcSheet}
   * @param {FocusEvent} event
   * @param {HTMLElement} target
   */
  static async #itemCostFocusOut(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    let item = this.document.items.get(div.dataset.itemId);
    await item.update({"system.cost": target.value});
  }

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
}
