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

   /**
   * Return the dynamic tab configuration for this sheet.
   * This allows different actor types to define different tabs if needed.
   * @returns {object} The tabs configuration
   */
   _getTabsConfig(group) {
    const tabs = foundry.utils.deepClone(super._getTabsConfig(group))
    tabs.tabs.push({id: 'stats', label: 'TAB.STATS', icon: 'fa-solid fa-chart-bar', cssClass: 'tab-stats'});
    tabs.tabs.push({id: 'combat', label: 'TAB.COMBAT', icon: 'fa-solid fa-shield', cssClass: 'tab-combat'});
    tabs.tabs.push({id: 'abilities', label: 'TAB.ABILITIES', icon: 'fa-solid fa-star', cssClass: 'tab-abilities'});
    tabs.tabs.push({id: 'psychic-powers', label: 'TAB.PSYCHIC_POWERS', icon: 'fa-solid fa-wand-magic-sparkles', cssClass: 'tab-psychic-powers'});
    tabs.tabs.push({id: 'gear', label: 'TAB.GEAR', icon: 'fa-solid fa-backpack', cssClass: 'tab-gear'});
    tabs.tabs.push({id: 'progression', label: 'TAB.ADVANCES', icon: 'fa-solid fa-arrow-up', cssClass: 'tab-progression'});
    tabs.tabs.push({id: 'notes', label: 'TAB.NOTES', icon: 'fa-solid fa-note-sticky', cssClass: 'tab-notes'});
    return tabs;
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    sheet: {
      id: "sheet",
      group: "primary",
      tabs: [
        {
          id: "stats",
          group: "primary",
          label: "TAB.STATS",
          icon: "fa-solid fa-chart-bar",
          cssClass: "tab-stats"
        },
        {
          id: "combat",
          group: "primary",
          label: "TAB.COMBAT",
          icon: "fa-solid fa-shield",
          cssClass: "tab-combat"
        },
        {
          id: "abilities",
          group: "primary",
          label: "TAB.ABILITIES",
          icon: "fa-solid fa-star",
          cssClass: "tab-abilities"
        },
        {
          id: "psychic-powers",
          group: "primary",
          label: "TAB.PSYCHIC_POWERS",
          icon: "fa-solid fa-wand-magic-sparkles",
          cssClass: "tab-psychic-powers"
        },
        {
          id: "gear",
          group: "primary",
          label: "TAB.GEAR",
          icon: "fa-solid fa-backpack",
          cssClass: "tab-gear"
        },
        {
          id: "progression",
          group: "primary",
          label: "TAB.ADVANCES",
          icon: "fa-solid fa-arrow-up",
          cssClass: "tab-progression"
        },
        {
          id: "notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "tab-notes"
        }
      ],
      initial: "stats"
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/explorer.html"
    },
    stats: {
      template: "systems/rogue-trader/template/sheet/actor/tab/stats.html"
    },
    combat: {
      template: "systems/rogue-trader/template/sheet/actor/tab/combat.html"
    },
    abilities: {
      template: "systems/rogue-trader/template/sheet/actor/tab/abilities.html"
    },
    psychicPowers: {
      template: "systems/rogue-trader/template/sheet/actor/tab/psychic-powers.html"
    },
    gear: {
      template: "systems/rogue-trader/template/sheet/actor/tab/gear.html"
    },
    progression: {
      template: "systems/rogue-trader/template/sheet/actor/tab/progression.html"
    },
    notes: {
      template: "systems/rogue-trader/template/sheet/actor/tab/notes.html"
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
