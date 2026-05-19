import RogueTraderSheet from "./actor.mjs";

export default class NpcSheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS with configuration
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "npc-sheet",
    classes: ["rogue-trader", "sheet", "actor", "npc"],
    actions: {
      itemCostFocusOut: NpcSheet.#itemCostFocusOut
    }
  };

  static METADATA = {
    types: ["npc"],
    makeDefault: true,
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    primary: {
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

    // Adjust partials for npc-specific tabs
    for (const tab of context.tabs.primary.tabs) {
      if (tab.id === 'stats') {
        tab.partial = 'systems/rogue-trader/template/sheet/actor/tab/npc-stats.html';
      } else if (tab.id === 'notes') {
        tab.partial = 'systems/rogue-trader/template/sheet/actor/tab/npc-notes.html';
      }
    }

    return context;
  }


}
