import { RogueTraderSheet } from "./actor.js";

export class ExplorerSheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "explorer-sheet",
    classes: ["rogue-trader", "sheet", "actor", "explorer"],
    actions: {
      aptitudeCreate: ExplorerSheet.#aptitudeCreate,
      aptitudeDelete: ExplorerSheet.#aptitudeDelete,
      itemCostFocusOut: ExplorerSheet.#itemCostFocusOut
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/explorer.html"
    }
  };

  /**
   * Handle aptitude creation.
   * @this {ExplorerSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #aptitudeCreate(event, target) {
    event.preventDefault();
    let aptitudeId = Date.now().toString();
    let aptitude = { id: Date.now().toString(), name: "New Aptitude" };
    await this.document.update({[`system.aptitudes.${aptitudeId}`]: aptitude});
    this.render(false);
  }

  /**
   * Handle aptitude deletion.
   * @this {ExplorerSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #aptitudeDelete(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const aptitudeId = div.dataset.aptitudeId.toString();
    await this.document.update({[`system.aptitudes.-=${aptitudeId}`]: null});
    this.render(false);
  }

  /**
   * Handle item cost focus out.
   * @this {ExplorerSheet}
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
  // This provides data-specific enrichment for the Explorer sheet
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
