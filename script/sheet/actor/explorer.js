import { RogueTraderSheet } from "./actor.js";

export class ExplorerSheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "explorer-sheet",
    classes: ["rogue-trader", "sheet", "actor", "explorer"]
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/explorer.html"
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

  // v13 MIGRATION: appv2 form submission - DocumentSheetV2 handles name="system.*" fields automatically
  // This listener handles custom aptitude creation and item cost submission
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".aptitude-create").click(async ev => { await this._onAptitudeCreate(ev); });
    html.find(".aptitude-delete").click(async ev => { await this._onAptitudeDelete(ev); });
    html.find(".item-cost").focusout(async ev => { await this._onItemCostFocusOut(ev); });
  }

  async _onAptitudeCreate(event) {
    event.preventDefault();
    let aptitudeId = Date.now().toString();
    let aptitude = { id: Date.now().toString(), name: "New Aptitude" };
    await this.document.update({[`system.aptitudes.${aptitudeId}`]: aptitude});
    this.render(false);
  }

  async _onAptitudeDelete(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const aptitudeId = div.data("aptitudeId").toString();
    await this.document.update({[`system.aptitudes.-=${aptitudeId}`]: null});
    this.render(false);
  }

  async _onItemCostFocusOut(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    let item = this.document.items.get(div.data("itemId"));
    item.update({"system.cost": $(event.currentTarget)[0].value});
  }
}
