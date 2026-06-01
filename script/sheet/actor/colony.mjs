import { prepareCommonRoll, prepareConsumeResourcesRoll } from "../../common/dialog.js";
import { rollColonyEvents, rollColonyGrowth } from "../../common/roll.js";
import RogueTraderUtil from "../../common/util.js";
import RogueTraderSheet from "./actor.mjs";

export default class ColonySheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "colony-sheet",
    classes: ["rogue-trader", "sheet", "actor", "colony"],
    position: {
      width: 750,
      height: 920
    },
    actions: {
      rollGrowth: ColonySheet.#rollGrowth,
      rollEvents: ColonySheet.#rollEvents,
      rollGovernor: ColonySheet.#rollGovernor,
      rollResources: ColonySheet.#rollResources
    }
  };

  static METADATA = {
    types: ["colony"],
    makeDefault: true,
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    primary: {
      tabs: [
        {
          id: "colony-core",
          group: "primary",
          label: "TAB.CORE",
          icon: "fa-solid fa-home",
          cssClass: "tab-core"
        },
        {
          id: "colony-upgrades",
          group: "primary",
          label: "TAB.UPGRADES",
          icon: "fa-solid fa-arrow-up",
          cssClass: "tab-upgrades"
        },
        {
          id: "colony-notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "tab-notes"
        }
      ],
      initial: "colony-core"
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/colony.html",
      scrollable: [''],
    }
  };

  /**
   * Handle colony growth roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollGrowth(event, target) {
    event.preventDefault();
    const context = await this._prepareContext();
    const growthData = this._updateGrowthPoints(context);
    await rollColonyGrowth(RogueTraderUtil.prepareColonyGrowthRollData(this.document, growthData));
    await this.document.update(context.system);
  }

  /**
   * Handle colony events roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollEvents(event, target) {
    event.preventDefault();
    await rollColonyEvents(RogueTraderUtil.prepareColonyRollData(this.document));
  }

  /**
   * Handle governor skill roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollGovernor(event, target) {
    event.preventDefault();
    await this._prepareGovernorRoll();
  }

  /**
   * Handle resource consumption roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollResources(event, target) {
    event.preventDefault();
    await prepareConsumeResourcesRoll(RogueTraderUtil.prepareResourceRollData(this.document), this.document);
  }

  _updateGrowthPoints(context) {
    const actorStats = context.system.stats;
    const startLoyalty = actorStats.loyalty;
    const startProsperity = actorStats.prosperity;
    const startSecurity = actorStats.security;
    actorStats.loyalty += actorStats.loyaltyGain;
    actorStats.prosperity += actorStats.prosperityGain;
    actorStats.security += actorStats.securityGain;
    switch (context.system.governor.governorType) {
      case "accounting":
        actorStats.prosperity = Math.max(actorStats.prosperity, 0);
        break;
      case "local":
        actorStats.loyalty = Math.max(actorStats.loyalty, 0);
        break;
      case "warlike":
        actorStats.security = Math.max(actorStats.security, 0);
        break;
    }
    return {
      loyalty: {
        start: startLoyalty,
        updated: actorStats.loyalty,
        difference: actorStats.loyalty - startLoyalty
      },
      prosperity: {
        start: startProsperity,
        updated: actorStats.prosperity,
        difference: actorStats.prosperity - startProsperity
      },
      security: {
        start: startSecurity,
        updated: actorStats.security,
        difference: actorStats.security - startSecurity
      }
    }
  }

  async _prepareGovernorRoll() {
    const context = await this._prepareContext();
    const rollData = {
      name: "DIALOG.GOVERNOR_SKILL_ROLL",
      baseTarget: context.system.governor.skillBonus,
      modifier: 0,
      ownerId: context.system.governor.actor
    };
    await prepareCommonRoll(rollData);
  }

  async _onDropActor(event, data) {
    const context = await this._prepareContext();
    const droppedActor = game.actors.get(data.uuid.split(".")[1]);
    if (droppedActor) {
      switch (event.target.dataset.crewRole) {
        case "governor":
          {
            context.system.governor.actor = droppedActor.id;
            break;
          }
        default:
          console.log(event.target.dataset.crewRole);
          break;
      }
      await this.document.update(context.system);
    }
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
