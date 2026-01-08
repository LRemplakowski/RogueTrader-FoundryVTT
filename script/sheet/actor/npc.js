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
  // DocumentSheetV2 automatically handles form submission with name="system.*" fields
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/npc.html"
    },
    stats: {
      template: "systems/rogue-trader/template/sheet/actor/tab/npc-stats.html"
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
      template: "systems/rogue-trader/template/sheet/actor/tab/npc-notes.html"
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

  /**
   * Return the dynamic tab configuration for this sheet.
   * This allows different actor types to define different tabs if needed.
   * @param {string} group - The tab group to retrieve configuration for
   * @returns {object} The tabs configuration
   */
  _getTabsConfig(group) {
    const tabs = foundry.utils.deepClone(super._getTabsConfig(group));
    tabs.primary.tabs.push({id: 'stats', group: 'primary', label: 'TAB.STATS', icon: 'fa-solid fa-chart-bar', cssClass: 'tab-stats'});
    tabs.primary.tabs.push({id: 'combat', group: 'primary', label: 'TAB.COMBAT', icon: 'fa-solid fa-shield', cssClass: 'tab-combat'});
    tabs.primary.tabs.push({id: 'abilities', group: 'primary', label: 'TAB.ABILITIES', icon: 'fa-solid fa-star', cssClass: 'tab-abilities'});
    tabs.primary.tabs.push({id: 'psychic-powers', group: 'primary', label: 'TAB.PSYCHIC_POWERS', icon: 'fa-solid fa-wand-magic-sparkles', cssClass: 'tab-psychic-powers'});
    tabs.primary.tabs.push({id: 'gear', group: 'primary', label: 'TAB.GEAR', icon: 'fa-solid fa-backpack', cssClass: 'tab-gear'});
    tabs.primary.tabs.push({id: 'progression', group: 'primary', label: 'TAB.ADVANCES', icon: 'fa-solid fa-arrow-up', cssClass: 'tab-progression'});
    tabs.primary.tabs.push({id: 'notes', group: 'primary', label: 'TAB.NOTES', icon: 'fa-solid fa-note-sticky', cssClass: 'tab-notes'});
    tabs.primary.initial = 'stats';
    return tabs;
  }
}
