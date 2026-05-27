import {prepareCommonRoll, prepareShipCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import RogueTraderSheet from "./actor.mjs";

export default class ShipSheet extends RogueTraderSheet {
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

  static METADATA = {
    types: ["voidship"],
    makeDefault: true,
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    primary: {
      tabs: [
        {
          id: "ship-data",
          group: "primary",
          label: "TAB.DATA",
          icon: "fa-solid fa-database",
          cssClass: "tab-data"
        },
        {
          id: "ship-combat",
          group: "primary",
          label: "TAB.COMBAT",
          icon: "fa-solid fa-shield",
          cssClass: "tab-combat"
        },
        {
          id: "ship-crew",
          group: "primary",
          label: "TAB.CREW",
          icon: "fa-solid fa-people-group",
          cssClass: "tab-crew"
        },
        {
          id: "ship-essential",
          group: "primary",
          label: "TAB.ESSENTIAL_COMPONENTS",
          icon: "fa-solid fa-cogs",
          cssClass: "tab-essential"
        },
        {
          id: "ship-supplemental",
          group: "primary",
          label: "TAB.SUPPLEMENTAL_COMPONENTS",
          icon: "fa-solid fa-wrench",
          cssClass: "tab-supplemental"
        },
        {
          id: "ship-weapons",
          group: "primary",
          label: "TAB.WEAPONS",
          icon: "fa-solid fa-gun",
          cssClass: "tab-weapons"
        },
        {
          id: "ship-complications",
          group: "primary",
          label: "TAB.COMPLICATIONS",
          icon: "fa-solid fa-exclamation-triangle",
          cssClass: "tab-complications"
        },
        {
          id: "ship-notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "tab-notes"
        }
      ],
      initial: "ship-data"
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/ship.html"
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
    const droppedActorId = data.uuid.split(".")[1];
    const role = event.target.dataset.crewrole;
    if (!role) return;

    await this.actor.update({
      [`system.namedCrew.${role}.id`]: droppedActorId
    });
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


}
