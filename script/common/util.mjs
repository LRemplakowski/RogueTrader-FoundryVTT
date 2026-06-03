import * as enums from "../data/enums/_module.mjs";

export default class RogueTraderUtil {
  static preapareDropdownOptions() {
    // TODO: Convert this to iterator over enums
    const result = {
      craftsmanshipOptions: enums.Craftsmanship.options(),
      availabilityOptions: enums.Availability.options(),
      damageTypeOptions: enums.DamageType.options(),
      shipWeaponClassOptions: enums.ShipWeaponClass.options(),
      shipFacingOptions: enums.ShipFacing.options(),
      shipComponentClassOptions: enums.ShipComponentClass.options(),
      armourTypeOptions: enums.ArmourType.options(),
      criticalInjuryPartOptions: enums.HitLocations.options(),
      crewSkillOptions: enums.CrewSkill.options(),
      characteristicOptions: enums.Characteristics.options(),
      characteristicAdvanceOptions: enums.CharacteristicAdvance.options(),
      npcTypeOptions: enums.NPCType.options(),
      skillAdvanceOptions: enums.SkillAdvance.options(),
      psyClassOptions: enums.PsyClass.options(),
      psyStrengthOptions: enums.PsyStrength.options(),
      psyZoneOptions: enums.PsyZone.options(),
      initiativeOptions: enums.Characteristics.options(),
      governorTypeOptions: enums.GovernorType.options(),
      colonyTypeOptions: enums.ColonyType.options(),
      hullClassOptions: enums.HullClass.options(),
      hullClassOptions: enums.HullClass.options(),
      skillsOptions: enums.Skills.options(),
      weaponClassOptions: enums.WeaponClass.options(),
      weaponTypeOptions: enums.WeaponType.options()
    };
    return result;
  }


  static prepareColonyRollData(actor) {
    const rollData = {
      positiveEventTarget: 9,
      negativeEventTarget: 3,
    };
    const representative = actor.system.governor.governorType;
    switch (representative) {
      case "administrative":
        rollData.negativeEventTarget = 1;
        break;
      case "faithful":
        rollData.negativeEventTarget = 2;
        rollData.positiveEventTarget = 8;
        break;
    }
    return rollData;
  }

  static prepareColonyGrowthRollData(actor, growthData) {
    growthData.requiredGrowth = actor.system.stats.requiredGrowth;
    growthData.shouldGrow = this._hasEnoughGrowth(actor, growthData);
    growthData.shouldDecreaseSize = this._shouldDecreaseSize(actor, growthData);
    growthData.actor = actor;
    console.log(growthData);
    return growthData;
  }

  static _hasEnoughGrowth(actor, growthData) {
    return (growthData.loyalty.updated >= growthData.requiredGrowth &&
            growthData.prosperity.updated >= growthData.requiredGrowth &&
            growthData.security.updated >= growthData.requiredGrowth);
  }

  static _shouldDecreaseSize(actor, growthData) {
    let negativeStatsCount = 0;
    if (growthData.loyalty.updated < 0)
      negativeStatsCount += 1;
    if (growthData.prosperity.updated < 0)
      negativeStatsCount += 1;
    if (growthData.security.updated < 0)
      negativeStatsCount += 1;
    return negativeStatsCount >= 2;
  }

  static prepareResourceRollData(actor) {
    const actorData = actor.system;
    const colonySize = actorData.stats.size;
    let governorResourcePenalty = 0;
    if (actorData.governor.governorType === "relaxed") {
      governorResourcePenalty = Math.min(5, Math.ceil(colonySize / 3));
    }
    const rollData = {
      name: "DIALOG.CONSUME_RESOURCES_ROLL",
      ownerId: actor.uuid.split('.')[1],    
      resources: actorData.resources,
      actor: actor,
      requiredResources: colonySize + 1,
      consumedAmount: `1d10 + ${colonySize + governorResourcePenalty}`,
      burnedAmount: `${colonySize}d10 + ${5 * colonySize} + ${governorResourcePenalty}`,
      selectedResource: actorData.resources?.length > 0 ? actorData.resources[0] : null,
      burnResources: false,
      conserveResources: false,
      burnData: {
        burnType: "profitFactor",
        generated: 0
      }
    };
    return rollData;
  }

  static createCommonShipRollData(actor, item) {
    return {
      name: item.name,
      ownerId: actor.id,
      itemId: item.id,
    };
  }

  static createShipWeaponRollData(actor, weapon) {
    let rollData = this.createCommonShipRollData(actor, weapon)
    const actorData = actor.system;
    const weaponData = weapon.system;
    const masterOrdnance = actorData.crew.namedCrew.masterOrdnance;
    if (masterOrdnance.actor)
      rollData.baseTarget = masterOrdnance.characteristics[enums.Characteristics.KEYS.ballisticSkill].value;
    else
      rollData.baseTarget = enums.CrewSkill.DATA[actorData.crew.skill].rating ?? 0;
    rollData.characteristicSource = actor;
    rollData.modifier = 0;
    rollData.damageBonus = 0;
    rollData.damageFormula = weaponData.damage;
    rollData.weaponType = weaponData.class;
    rollData.weaponStrength = weaponData.strength;
    rollData.critRating = weaponData.critRating;
    rollData.side = weaponData.side;
    rollData.ignoreArmor = weaponData.ignoreArmour;
    rollData.ignoreShields = weaponData.ignoreShields;
    rollData.dosPerHit = weaponData.rof;
    return rollData;
  }
  
  static createPsychicRollData(actor, power) {
    let focusPowerTarget = this.getFocusPowerTarget(actor, power);
    
    let rollData = this.createCommonAttackRollData(actor, power); 
    rollData.baseTarget= focusPowerTarget.total;
    rollData.modifier= power.focusPower.difficulty;      
    rollData.damageFormula= power.damage.formula;      
    rollData.penetrationFormula= power.damage.penetration;
    rollData.attackType= { name: power.damage.zone, text: "" };
    rollData.weaponTraits= this.extractWeaponTraits(power.damage.special);
    rollData.special= power.damage.special;
    rollData.psy = {
        value: actor.psy.rating,
        rating: actor.psy.rating,
        psyStrength: "fettered",
        push: 1,
        maxPush: this.getMaxPsyRating(actor) - actor.psy.rating,
        warpConduit: false,
        disciplineMastery: false,
        display: true
    };
    return rollData;
  }
  
  static extractWeaponTraits(traits) {
    // These weapon traits never go above 9 or below 2
    return {
      accurate: this.hasNamedTrait(/Accurate/gi, traits),
      rfFace: this.extractNumberedTrait(/Vengeful\s*\(?\s*\d+\s*\)?/gi, traits), // The alternativ die face Righteous Fury is triggered on
      proven: this.extractNumberedTrait(/Proven\s*\(?\s*\d+\s*\)?/gi, traits),
      primitive: this.extractNumberedTrait(/Primitive\s*\(?\s*\d+\s*\)?/gi, traits),
      razorSharp: this.hasNamedTrait(/Razor *Sharp/gi, traits),
      skipAttackRoll: this.hasNamedTrait(/Spray/gi, traits),
      tearing: this.hasNamedTrait(/Tearing/gi, traits),
      force: this.hasNamedTrait(/Force/gi, traits),
      warp: this.hasNamedTrait(/Warp/gi, traits),
      scatter: this.hasNamedTrait(/Scatter/gi, traits),
      melta: this.hasNamedTrait(/Melta/gi, traits),
      maximal: this.hasNamedTrait(/Maximal/gi, traits),
      storm: this.hasNamedTrait(/Storm/gi, traits),
      twinLinked: this.hasNamedTrait(/twin[\s\W_]*linked/i, traits),
    };
  }

  static getMaxPsyRating(actor) {
    let base = actor.psy.rating;
    switch (actor.psy.class) {
      case "bound":
        return base + 3;
      case "unbound":
        return base + 4;
      case "daemonic":
        return base + 4;
    }
  }

  static extractNumberedTrait(regex, traits) {
    let rfMatch = traits.match(regex);
    if (rfMatch) {
      regex = /\d+/gi;
      return parseInt(rfMatch[0].match(regex)[0]);
    }
    return undefined;
  }

  static hasNamedTrait(regex, traits) {
    return traits.match(regex);
  }
  
  static getWeaponCharacteristic(actor, weapon) {
    if (weapon.class === "melee") {
      return actor.characteristics.weaponSkill;
    } else {
      return actor.characteristics.ballisticSkill;
    }
  }

  static getFocusPowerTarget(actor, psychicPower) {
    const normalizeName = psychicPower.focusPower.test.toLowerCase();
    if (actor.characteristics.hasOwnProperty(normalizeName)) {
      return actor.characteristics[normalizeName];
    } else if (actor.skills.hasOwnProperty(normalizeName)) {
      return actor.skills[normalizeName];
    } else {
      return actor.characteristics.willpower;
    }
  }

  static getMaxEncumbrance(attributeBonus) {
    switch (attributeBonus) {
      case 0:  return 0.9;
      case 1:  return 2.25;
      case 2:  return 4.5;
      case 3:  return 9;
      case 4:  return 18;
      case 5:  return 27;
      case 6:  return 36;
      case 7:  return 45;
      case 8:  return 56;
      case 9:  return 67;
      case 10: return 78;
      case 11: return 90;
      case 12: return 112;
      case 13: return 225;
      case 14: return 337;
      case 15: return 450;
      case 16: return 675;
      case 17: return 900;
      case 18: return 1350;
      case 19: return 1800;
      case 20: return 2250;
      default: return 2250;
    }
  }

  /**
   * Compute the characteristic bonus.
   *
   * @param {number} value      The characteristic's total value.
   * @param {number} unnatural  The unnatural bonus applied to the characteristic.
   * @returns {number}          The computed bonus.
   */
  static getCharacteristicBonus(value, unnatural) {
    return Math.floor(value / 10) + unnatural;
  }
}

