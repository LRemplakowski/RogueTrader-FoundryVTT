import {prepareCommonRoll, prepareShipCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ShipSheet extends RogueTraderSheet {
  side = "";

  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "ship-sheet",
    classes: ["rogue-trader", "sheet", "actor", "ship"],
    position: {
      width: 775,
      height: 835
    },
    actions: {
      rollShipWeapon: ShipSheet.#rollShipWeapon
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
          id: "data",
          group: "primary",
          label: "TAB.DATA",
          icon: "fa-solid fa-database",
          cssClass: "tab-data"
        },
        {
          id: "combat",
          group: "primary",
          label: "TAB.COMBAT",
          icon: "fa-solid fa-shield",
          cssClass: "tab-combat"
        },
        {
          id: "crew",
          group: "primary",
          label: "TAB.CREW",
          icon: "fa-solid fa-people-group",
          cssClass: "tab-crew"
        },
        {
          id: "essential",
          group: "primary",
          label: "TAB.ESSENTIAL_COMPONENTS",
          icon: "fa-solid fa-cogs",
          cssClass: "tab-essential"
        },
        {
          id: "supplemental",
          group: "primary",
          label: "TAB.SUPPLEMENTAL_COMPONENTS",
          icon: "fa-solid fa-wrench",
          cssClass: "tab-supplemental"
        },
        {
          id: "weapons",
          group: "primary",
          label: "TAB.WEAPONS",
          icon: "fa-solid fa-gun",
          cssClass: "tab-weapons"
        },
        {
          id: "complications",
          group: "primary",
          label: "TAB.COMPLICATIONS",
          icon: "fa-solid fa-exclamation-triangle",
          cssClass: "tab-complications"
        },
        {
          id: "notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "tab-notes"
        }
      ],
      initial: "data"
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/ship.html"
    },
    data: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-data.html"
    },
    combat: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-combat.html"
    },
    crew: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-crew.html"
    },
    essential: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-essential.html"
    },
    supplemental: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-supplemental.html"
    },
    weapons: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-weapons.html"
    },
    complications: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-complications.html"
    },
    notes: {
      template: "systems/rogue-trader/template/sheet/actor/tab/ship-notes.html"
    }
  };

  /**
   * Handle ship weapon roll.
   * @this {ShipSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollShipWeapon(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const weapon = this.document.items.get(div.dataset.itemId);
    await prepareShipCombatRoll(
      RogueTraderUtil.createShipWeaponRollData(this.document, weapon), 
      this.document
    );
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }

  async selectTargetToken() {
    this.minimize();
    this.selectedToken = null;
    ui.notifications.info("Choose a target on the board.");
    Hooks.on("targetToken", this.onTokenSelected.bind(this));
    while (!this.selectedToken) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Hooks.off("targetToken", this.onTokenSelected);
    console.log("selected token");
    console.log(this.selectedToken);
    this.maximize();
    if (!this.selectedToken) {
      ui.notifications.error("No target selected on the board.");
    }
  }

  onTokenSelected(user, token, targeted) {
    if (targeted)
      this.selectedToken = token;
  }

  async _onDrop(event) {
    this.side = event.target.dataset.shipside || "port";
    return await super._onDrop(event);
  }

  async _onDropActor(event, data) {
    const context = await this._prepareContext();
    const droppedActor = game.actors.get(data.uuid.split(".")[1]);
    switch (event.target.dataset.crewrole) {
      case "captain":
        {
          context.system.namedCrew.lordCaptain = data.uuid.split(".")[1];
          break;
        }
      case "firstOfficer":
        {
          context.system.namedCrew.firstOfficer = data.uuid.split(".")[1];
          break;
        }
      case "enginseerPrime": 
        {
          context.system.namedCrew.enginseerPrime = data.uuid.split(".")[1];
          break;
        }
      case "highFactotum": 
        {
          context.system.namedCrew.highFactotum = data.uuid.split(".")[1];
          break;
        }
      case "masterArms": 
        {
          context.system.namedCrew.masterArms = data.uuid.split(".")[1];
          break;
        }
      case "masterHelmsman": 
        {
          context.system.namedCrew.masterHelmsman = data.uuid.split(".")[1];
          break;
        }
      case "masterOrdnance":
        {
          context.system.namedCrew.masterOrdnance = data.uuid.split(".")[1];
          break;
        }
      case "masterEtherics": 
        {
          context.system.namedCrew.masterEtherics = data.uuid.split(".")[1];
          break;
        }
      case "masterChirurgeon":
        {
          context.system.namedCrew.masterChirurgeon = data.uuid.split(".")[1];
          break;
        }
      case "masterWhispers": 
        {
          context.system.namedCrew.masterWhispers = data.uuid.split(".")[1];
          break;
        }
      case "masterTelepathica":
        {
          context.system.namedCrew.masterTelepathica = data.uuid.split(".")[1];
          break;
        }
      case "masterWarp":
        {
          context.system.namedCrew.masterWarp = data.uuid.split(".")[1];
          break;
        }
      case "confessor":
        {
          context.system.namedCrew.confessor = data.uuid.split(".")[1];
          break;
        }
      case "drivesmaster":
        {
          context.system.namedCrew.drivesmaster = data.uuid.split(".")[1];
          break;
        }
      case "congregator":
        {
          context.system.namedCrew.congregator = data.uuid.split(".")[1];
          break;
        }
      case "bosun":
        {
          context.system.namedCrew.bosun = data.uuid.split(".")[1];
          break;
        }
      case "infernus":
        {
          context.system.namedCrew.infernus = data.uuid.split(".")[1];
          break;
        }
      case "twistcatcher":
        {
          context.system.namedCrew.twistcatcher = data.uuid.split(".")[1];
          break;
        }
      case "voxmaster":
        {
          context.system.namedCrew.voxmaster = data.uuid.split(".")[1];
          break;
        }
      case "purser":
        {
          context.system.namedCrew.purser = data.uuid.split(".")[1];
          break;
        }
      case "cartographer":
        {
          context.system.namedCrew.cartographer = data.uuid.split(".")[1];
          break;
        }
      case "steward":
        {
          context.system.namedCrew.steward = data.uuid.split(".")[1];
          break;
        }
      default:
        console.log(event.target.dataset.crewRole);
        break;
    }
    this.document.update(context.system);
  }

  async _onDropItemCreate(itemData) {
    const context = await this._prepareContext();
    if (itemData.type === "shipWeapon") {
      itemData.system.side = this.side;
      return await this.validateShipWeapon(context, itemData);
    }
    else if (itemData.type === "shipComponent") {
      return await this.validateShipComponent(context, itemData);
    } 
    else {
      return await super._onDropItemCreate(itemData);
    }
  }

  async validateShipComponent(context, itemData) {
    const componentClasses = ["voidEngine", "warpEngine", "gellarField", "voidShield", "bridge", "lifeSupport", "crewQuarters", "augurArrays"];
    for (const componentClass of componentClasses) {
      if (itemData.system.class === componentClass && context.items[componentClass] !== undefined) {
        this.sendEssentialComponentLimitReachedPopup();
        return;
      }
    }
    return await super._onDropItemCreate(itemData);
  }

  async validateShipWeapon(context, itemData) {
    const weaponArrays = {
      port: context.items.portWeapons,
      star: context.items.starWeapons,
      dorsal: context.items.dorsalWeapons,
      keel: context.items.keelWeapons,
      prow: context.items.prowWeapons
    };
    const weaponCapacity = context.system.weaponCapacity[this.side];
    const weapons = weaponArrays[this.side];
    if (weapons.length >= weaponCapacity) {
      this.sendWeaponLimitReachedPopup();
      return;
    }
    return await super._onDropItemCreate(itemData);
  }

  sendWeaponLimitReachedPopup() {
    ui.notifications.warn("Not enough weapon slots!");
  }

  sendEssentialComponentLimitReachedPopup() {
    ui.notifications.warn("That component is already installed!");
  }

  async _onDropItem(event, data) {
    const items = await super._onDropItem(event, data);
    let context = await this._prepareContext();
    await this.document.update(context.system);
    return items;
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    context.system.pastHistoryHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.pastHistory,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.system.complicationsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.complications,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.system.notesHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.notes,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
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
    tabs.primary.tabs.push({id: 'data', group: 'primary', label: 'TAB.DATA', icon: 'fa-solid fa-database', cssClass: 'tab-data'});
    tabs.primary.tabs.push({id: 'combat', group: 'primary', label: 'TAB.COMBAT', icon: 'fa-solid fa-shield', cssClass: 'tab-combat'});
    tabs.primary.tabs.push({id: 'crew', group: 'primary', label: 'TAB.CREW', icon: 'fa-solid fa-people-group', cssClass: 'tab-crew'});
    tabs.primary.tabs.push({id: 'essential', group: 'primary', label: 'TAB.ESSENTIAL_COMPONENTS', icon: 'fa-solid fa-cogs', cssClass: 'tab-essential'});
    tabs.primary.tabs.push({id: 'supplemental', group: 'primary', label: 'TAB.SUPPLEMENTAL_COMPONENTS', icon: 'fa-solid fa-wrench', cssClass: 'tab-supplemental'});
    tabs.primary.tabs.push({id: 'weapons', group: 'primary', label: 'TAB.WEAPONS', icon: 'fa-solid fa-gun', cssClass: 'tab-weapons'});
    tabs.primary.tabs.push({id: 'complications', group: 'primary', label: 'TAB.COMPLICATIONS', icon: 'fa-solid fa-exclamation-triangle', cssClass: 'tab-complications'});
    tabs.primary.tabs.push({id: 'notes', group: 'primary', label: 'TAB.NOTES', icon: 'fa-solid fa-note-sticky', cssClass: 'tab-notes'});
    tabs.primary.initial = 'data';
    return tabs;
  }
}
