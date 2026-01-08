import { prepareCommonRoll, prepareConsumeResourcesRoll } from "../../common/dialog.js";
import { rollColonyEvents, rollColonyGrowth } from "../../common/roll.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ColonySheet extends RogueTraderSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "colony-sheet",
    classes: ["rogue-trader", "sheet", "actor", "colony"],
    position: {
      width: 750,
      height: 920
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/colony.html"
    }
  };

  // v13 MIGRATION: appv2 form submission - DocumentSheetV2 handles name="system.*" fields automatically
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".roll-growth").click(async ev => await this._onRollColonyGrowth(ev));
    html.find(".roll-events").click(async ev => await this._onRollColonyEvents(ev));
    html.find(".roll-governor").click(async ev => await this._onRollGovernorSkill(ev));
    html.find(".roll-resources").click(async ev => await this._onRollConsumeResources(ev));
  }

  async _onRollColonyGrowth(ev) {
    ev.preventDefault();
    const context = await this._prepareContext();
    const growthData = this._updateGrowthPoints(context);
    await rollColonyGrowth(RogueTraderUtil.prepareColonyGrowthRollData(this.document, growthData));
    await this.document.update(context.system);
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

  async _onRollColonyEvents(ev) {
    ev.preventDefault();
    await rollColonyEvents(RogueTraderUtil.prepareColonyRollData(this.document));
  }

  async _onRollConsumeResources(ev) {
    ev.preventDefault();
    await prepareConsumeResourcesRoll(RogueTraderUtil.prepareResourceRollData(this.document), this.document);
  }

  async _onRollGovernorSkill(ev) {
    ev.preventDefault();
    await this._prepareGovernorRoll();
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
      switch (event.target.dataset.crewrole) {
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
}
