import {prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll, prepareForceFieldRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";

export class RogueTraderSheet extends ActorSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-create").click(ev => this._onItemCreate(ev));
    html.find(".item-edit").click(ev => this._onItemEdit(ev));
    html.find(".item-delete").click(ev => this._onItemDelete(ev));
    let inputs = html.find("input");
    inputs.focusin(ev => this._onFocusIn(ev));
    html.find(".roll-characteristic").click(async ev => await this._prepareRollCharacteristic(ev));
    html.find(".roll-skill").click(async ev => await this._prepareRollSkill(ev));
    html.find(".roll-speciality").click(async ev => await this._prepareRollSpeciality(ev));
    html.find(".roll-insanity").click(async ev => await this._prepareRollInsanity(ev));
    html.find(".roll-corruption").click(async ev => await this._prepareRollCorruption(ev));
    html.find(".roll-weapon").click(async ev => await this._prepareRollWeapon(ev));
    html.find(".roll-forceField").click(async ev => await this._prepareRollForceField(ev));
    // html.find(".roll-shipWeapon").click(async ev => await this._prepareRollShipWeapon(ev));
    html.find(".roll-psychic-power").click(async ev => await this._prepareRollPsychicPower(ev));
  }

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.system = data.data.system;
    data.items = this.constructItemLists(data)

    // Provide reusable option lists for actor templates using selectOptions
    const optionsData = {
      craftsmanshipOptions: [
        {value: 'poor', label: game.i18n.localize('CRAFTSMANSHIP.POOR')},
        {value: 'common', label: game.i18n.localize('CRAFTSMANSHIP.COMMON')},
        {value: 'good', label: game.i18n.localize('CRAFTSMANSHIP.GOOD')},
        {value: 'best', label: game.i18n.localize('CRAFTSMANSHIP.BEST')}
      ],
      availabilityOptions: [
        {value: 'ubiquitous', label: game.i18n.localize('AVAILABILITY.UBIQUITOUS')},
        {value: 'abundant', label: game.i18n.localize('AVAILABILITY.ABUNDANT')},
        {value: 'plentiful', label: game.i18n.localize('AVAILABILITY.PLENTIFUL')},
        {value: 'common', label: game.i18n.localize('AVAILABILITY.COMMON')},
        {value: 'average', label: game.i18n.localize('AVAILABILITY.AVERAGE')},
        {value: 'scarce', label: game.i18n.localize('AVAILABILITY.SCARCE')},
        {value: 'rare', label: game.i18n.localize('AVAILABILITY.RARE')},
        {value: 'very-rare', label: game.i18n.localize('AVAILABILITY.VERY_RARE')},
        {value: 'extremely-rare', label: game.i18n.localize('AVAILABILITY.EXTREMELY_RARE')},
        {value: 'near-unique', label: game.i18n.localize('AVAILABILITY.NEAR_UNIQUE')},
        {value: 'unique', label: game.i18n.localize('AVAILABILITY.UNIQUE')}
      ],
      damageTypeOptions: [
        {value: 'energy', label: game.i18n.localize('DAMAGE_TYPE.ENERGY')},
        {value: 'impact', label: game.i18n.localize('DAMAGE_TYPE.IMPACT')},
        {value: 'rending', label: game.i18n.localize('DAMAGE_TYPE.RENDING')},
        {value: 'explosive', label: game.i18n.localize('DAMAGE_TYPE.EXPLOSIVE')}
      ],
      shipWeaponClassOptions: [
        {value: 'macro', label: game.i18n.localize('SHIP_WEAPON.MACRO')},
        {value: 'lance', label: game.i18n.localize('SHIP_WEAPON.LANCE')},
        {value: 'torpedo', label: game.i18n.localize('SHIP_WEAPON.TORPEDO')},
        {value: 'hangar', label: game.i18n.localize('SHIP_WEAPON.HANGAR')}
      ],
      armourTypeOptions: [
        {value: 'basic', label: game.i18n.localize('ARMOUR_TYPE.BASIC')},
        {value: 'flak', label: game.i18n.localize('ARMOUR_TYPE.FLAK')},
        {value: 'mesh', label: game.i18n.localize('ARMOUR_TYPE.MESH')},
        {value: 'carapace', label: game.i18n.localize('ARMOUR_TYPE.CARAPACE')},
        {value: 'power', label: game.i18n.localize('ARMOUR_TYPE.POWER')},
        {value: 'other', label: game.i18n.localize('ARMOUR_TYPE.OTHER')}
      ],
      criticalInjuryPartOptions: [
        {value: 'head', label: game.i18n.localize('ARMOUR.HEAD')},
        {value: 'leftArm', label: game.i18n.localize('ARMOUR.LEFT_ARM')},
        {value: 'rightArm', label: game.i18n.localize('ARMOUR.RIGHT_ARM')},
        {value: 'body', label: game.i18n.localize('ARMOUR.BODY')},
        {value: 'leftLeg', label: game.i18n.localize('ARMOUR.LEFT_LEG')},
        {value: 'rightLeg', label: game.i18n.localize('ARMOUR.RIGHT_LEG')}
      ],
      // Crew skill options for ship actor templates
      crewSkillOptions: [
        {value: 'incompetent', label: game.i18n.localize('SHIP.CREW_INCOMPETENT')},
        {value: 'competent', label: game.i18n.localize('SHIP.CREW_COMPETENT')},
        {value: 'crack', label: game.i18n.localize('SHIP.CREW_CRACK')},
        {value: 'veteran', label: game.i18n.localize('SHIP.CREW_VETERAN')},
        {value: 'elite', label: game.i18n.localize('SHIP.CREW_ELITE')}
      ],
      // Characteristic advance options
      characteristicAdvanceOptions: [
        {value: 0, label: game.i18n.localize('ADVANCE.NONE')},
        {value: 5, label: game.i18n.localize('ADVANCE.SIMPLE')},
        {value: 10, label: game.i18n.localize('ADVANCE.INTERMEDIATE')},
        {value: 15, label: game.i18n.localize('ADVANCE.TRAINED')},
        {value: 20, label: game.i18n.localize('ADVANCE.PROFICIENT')},
        {value: 25, label: game.i18n.localize('ADVANCE.EXPERT')}
      ],
      // NPC type options
      npcTypeOptions: [
        { value: 'troop', label: game.i18n.localize('NPC_TYPE.TROOP') },
        { value: 'master', label: game.i18n.localize('NPC_TYPE.MASTER') },
        { value: 'elite', label: game.i18n.localize('NPC_TYPE.ELITE') }
      ],
      // Skill/speciality advance options
      skillAdvanceOptions: [
        {value: -20, label: game.i18n.localize('ADVANCE.UNTRAINED')},
        {value: 0, label: game.i18n.localize('ADVANCE.TRAINED')},
        {value: 10, label: game.i18n.localize('ADVANCE.EXPERT')},
        {value: 20, label: game.i18n.localize('ADVANCE.VETERAN')}
      ],
      // Psychic class options
      psyClassOptions: [
        {value: 'bound', label: game.i18n.localize('PSYCHIC_POWER.BOUND')},
        {value: 'unbound', label: game.i18n.localize('PSYCHIC_POWER.UNBOUND')},
        {value: 'daemonic', label: game.i18n.localize('PSYCHIC_POWER.DAEMONIC')}
      ],
      initiativeOptions: [],
      governorTypeOptions: [
        { value: 'administrative', label: game.i18n.localize('COLONY.GOV.ADMINISTRATIVE') },
        { value: 'faithful', label: game.i18n.localize('COLONY.GOV.FAITHFUL') },
        { value: 'lawful', label: game.i18n.localize('COLONY.GOV.LAWFUL') },
        { value: 'accounting', label: game.i18n.localize('COLONY.GOV.ACCOUNTING') },
        { value: 'local', label: game.i18n.localize('COLONY.GOV.LOCAL') },
        { value: 'relaxed', label: game.i18n.localize('COLONY.GOV.RELAXED') },
        { value: 'warlike', label: game.i18n.localize('COLONY.GOV.WARLIKE') }
      ],
      colonyTypeOptions: [
        { value: 'research', label: game.i18n.localize('COLONY.TYPE.RESEARCH') },
        { value: 'mining', label: game.i18n.localize('COLONY.TYPE.MINING') },
        { value: 'ecclesiastical', label: game.i18n.localize('COLONY.TYPE.ECCLESIASTICAL') },
        { value: 'agricultural', label: game.i18n.localize('COLONY.TYPE.AGRICULTURAL') },
        { value: 'pleasure', label: game.i18n.localize('COLONY.TYPE.PLEASURE') },
        { value: 'war', label: game.i18n.localize('COLONY.TYPE.WAR') },
      ],
      hullClassOptions: [
        { value: 'Transport', label: 'Transport' },
        { value: 'Raider', label: 'Raider' },
        { value: 'Frigate', label: 'Frigate' },
        { value: 'Light Cruiser', label: 'Light Cruiser' },
        { value: 'Cruiser', label: 'Cruiser' },
        { value: 'Battlecruiser', label: 'Battlecruiser' },
        { value: 'Grand Cruiser', label: 'Grand Cruiser' },
        { value: 'Battleship', label: 'Battleship' }
      ],
    };

    // Build initiative characteristic options from the actor's characteristics
    const initiativeOptions = [];
    for (const [key, char] of Object.entries(data.system.characteristics || {})) {
      initiativeOptions.push({ value: key, label: game.i18n.localize(char.label) });
    }
    optionsData.initiativeOptions = initiativeOptions;

    // Colony type options from actor.colonyTypes
    // const colonyTypeOptions = (this.actor.colonyTypes || []).map(ct => ({ value: ct, label: (function(t){
    //   switch(t) {
    //     case 'research': return game.i18n.localize('COLONY.TYPE.RESEARCH');
    //     case 'mining': return game.i18n.localize('COLONY.TYPE.MINING');
    //     case 'ecclesiastical': return game.i18n.localize('COLONY.TYPE.ECCLESIASTICAL');
    //     case 'agricultural': return game.i18n.localize('COLONY.TYPE.AGRICULTURAL');
    //     case 'pleasure': return game.i18n.localize('COLONY.TYPE.PLEASURE');
    //     case 'war': return game.i18n.localize('COLONY.TYPE.WAR');
    //     default: return ct;
    //   }
    // })(ct) }));

    // Attach generated option lists to data.options
    data.options = optionsData;

    return data;
  }

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/rogue-trader/template/sheet/actor/limited-sheet.html";
    } else {
      return this.options.template;
    }
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.actor.isOwner) {
      buttons = [
        {
          label: game.i18n.localize("BUTTON.ROLL"),
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: async ev => await this._prepareCustomRoll()
        }
      ].concat(buttons);
    }
    return buttons;
  }

  _onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget.dataset;

    let data = {
      name: `New ${game.i18n.localize(`TYPES.Item.${this.camelCase(header.type)}`)}`,
      type: header.type
    };
    this.actor.createEmbeddedDocuments("Item", [data], { renderSheet: true });
  }

  camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  _onItemEdit(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    let item = this.actor.items.get(div.data("itemId"));
    item.sheet.render(true);
  }

  _onItemDelete(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    this.actor.deleteEmbeddedDocuments("Item", [div.data("itemId")]);
    div.slideUp(200, () => this.render(false));
  }

  _onFocusIn(event) {
    $(event.currentTarget).select();
  }

  async _prepareCustomRoll() {
    const rollData = {
      name: "DIALOG.CUSTOM_ROLL",
      baseTarget: 50,
      modifier: 0,
      ownerId: this.actor.id
    };
    await prepareCommonRoll(rollData);
  }

  async _prepareRollCharacteristic(event) {
    event.preventDefault();
    const characteristicName = $(event.currentTarget).data("characteristic");
    const characteristic = this.actor.characteristics[characteristicName];
    const rollData = {
      name: characteristic.label,
      baseTarget: characteristic.total,
      modifier: 0,
      ownerId: this.actor.id,
      unnatural: characteristic.unnatural
    };
    await prepareCommonRoll(rollData);
  }

  _getCharacteristicOptions(selected) {
    const characteristics = [];
    for (let char of Object.values(this.actor.characteristics)) {
      characteristics.push({
        label: char.label,
        target: char.total,
        selected: char.short === selected,
        unnatural: char.unnatural
      });
    }
    return characteristics;
  }

  async _prepareRollSkill(event) {
    event.preventDefault();
    const skillName = $(event.currentTarget).data("skill");
    const skill = this.actor.skills[skillName];
    const defaultChar = skill.defaultCharacteristic || skill.characteristics[0];

    let characteristics = this._getCharacteristicOptions(defaultChar);
    characteristics = characteristics.map(char => {
      char.target += skill.advance;
      return char;
    });

    const rollData = {
      name: skill.label,
      baseTarget: skill.total,
      modifier: 0,
      characteristics: characteristics,
      ownerId: this.actor.id,
      unnatural: 0
    };
    await prepareCommonRoll(rollData);
  }

  async _prepareRollSpeciality(event) {
    event.preventDefault();
    const skillName = $(event.currentTarget).parents(".item").data("skill");
    const specialityName = $(event.currentTarget).data("speciality");
    const skill = this.actor.skills[skillName];
    const speciality = skill.specialities[specialityName];
    const rollData = {
      name: speciality.label,
      baseTarget: speciality.total,
      modifier: 0,
      ownerId: this.actor.id
    };
    await prepareCommonRoll(rollData);
  }

  async _prepareRollInsanity(event) {
    event.preventDefault();
    const characteristic = this.actor.characteristics.willpower;
    const rollData = {
      name: "FEAR.HEADER",
      baseTarget: characteristic.total,
      modifier: 0,
      ownerId: this.actor.id
    };
    await prepareCommonRoll(rollData);
  }

  async _prepareRollCorruption(event) {
    event.preventDefault();
    const characteristic = this.actor.characteristics.willpower;
    const rollData = {
      name: "CORRUPTION.HEADER",
      baseTarget: characteristic.total,
      modifier: this._getCorruptionModifier(),
      ownerId: this.actor.id
    };
    await prepareCommonRoll(rollData);
  }

  async _prepareRollWeapon(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const weapon = this.actor.items.get(div.data("itemId"));
    await prepareCombatRoll(
      RogueTraderUtil.createWeaponRollData(this.actor, weapon), 
      this.actor
    );
  }

  async _prepareRollForceField(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const forceField = this.actor.items.get(div.data("itemId"));
    await prepareForceFieldRoll(
      RogueTraderUtil.createForceFieldRollData(this.actor, forceField),
      this.actor
    );
  }

/*   async _prepareRollShipWeapon(event) {
    event.preventDefault();
    await this.selectTargetToken();
    if (this.selectedToken) {
      const div = $(event.currentTarget).parents(".item");
      const weapon = this.actor.items.get(div.data("itemId"));
      await prepareShipCombatRoll(
        RogueTraderUtil.createShipWeaponRollData(this.actor, weapon), 
        this.actor,
        this.selectedToken
      );
    }
  }
 */
  async _prepareRollPsychicPower(event) {
    event.preventDefault();
    const div = $(event.currentTarget).parents(".item");
    const psychicPower = this.actor.items.get(div.data("itemId"));    
    await preparePsychicPowerRoll(
      RogueTraderUtil.createPsychicRollData(this.actor, psychicPower)
    );
  }
  
  _getMaxPsyRating() {
    let base = this.actor.psy.rating;
    switch (this.actor.psy.class) {
      case "bound":
        return base + 2;
      case "unbound":
        return base + 4;
      case "daemonic":
        return base + 3;
    }
  }

  _getModifiers(modType) {
    let result = {}
    for (let list in this.actor.items) {
      switch (modType) {
        case 'characteristic':
          for (let itemType in this.actor.items[list]) {
            let items = this.actor.items[list][itemType];
            for (let item in items) {
              let itemModifiers = items[item].modifiers;
              for (let charMod in itemModifiers.characteristic) {
                if (result[charMod]) {
                  result[charMod].valueMod += itemModifiers.characteristic[charMod].valueMod;
                  result[charMod].unnaturalMod += itemModifiers.characteristic[charMod].unnaturalMod;
                }
                else {
                  result[charMod] = {
                    valueMod: itemModifiers.characteristic[charMod].valueMod,
                    unnaturalMod: itemModifiers.characteristic[charMod].unnaturalMod
                  };
                }
              }
            }
          }
          break;
        case 'skill':
          for (let itemType in this.actor.items[list]) {
            let items = this.actor.items[list][itemType];
            for (let item in items) {
              let itemModifiers = items[item].modifiers;
              for (let skillMod in itemModifiers.skill) {
                if (result[skillMod]) {
                  result[skillMod].valueMod += itemModifiers.skill[skillMod].valueMod;
                }
                else {
                  result[skillMod] = {
                    valueMod: itemModifiers.skill[skillMod].valueMod,
                  };
                }
              }
            }
          }
          break;
        case 'other':
          break;
      }
    }
  }

  _extractNumberedTrait(regex, traits) {
    let rfMatch = traits.match(regex);
    if (rfMatch) {
      regex = /\d+/gi;
      return parseInt(rfMatch[0].match(regex)[0]);
    }
    return undefined;
  }

  _hasNamedTrait(regex, traits) {
    let rfMatch = traits.match(regex);
    if (rfMatch) {
      return true;
    } else {
      return false;
    }
  }

  _getCorruptionModifier() {
    const corruption = this.actor.corruption;
    if (corruption <= 30) {
      return 0;
    } else if (corruption >= 31 && corruption <= 60) {
      return -10;
    } else if (corruption >= 61 && corruption <= 90) {
      return -20;
    } else if (corruption >= 91) {
      return -30;
    }
  }

  _getWeaponCharacteristic(weapon) {
    if (weapon.class === "melee") {
      return this.actor.characteristics.weaponSkill;
    } else {
      return this.actor.characteristics.ballisticSkill;
    }
  }

  _getFocusPowerTarget(psychicPower) {
    const normalizeName = psychicPower.focusPower.test.toLowerCase();
    if (this.actor.characteristics.hasOwnProperty(normalizeName)) {
      return this.actor.characteristics[normalizeName];
    } else if (this.actor.skills.hasOwnProperty(normalizeName)) {
      return this.actor.skills[normalizeName];
    } else {
      return this.actor.characteristics.willpower;
    }
  }

  constructItemLists() {
      let items = {}
      let itemTypes = this.actor.itemTypes;
      items.mentalDisorders = itemTypes["mentalDisorder"];
      items.malignancies = itemTypes["malignancy"];
      items.mutations = itemTypes["mutation"];
      if (this.actor.type === "npc") {
          items.abilities = itemTypes["talent"]
          .concat(itemTypes["trait"])
          .concat(itemTypes["specialAbility"]);
      }
      items.talents = itemTypes["talent"];
      items.traits = itemTypes["trait"];
      items.specialAbilities = itemTypes["specialAbility"];
      items.aptitudes = itemTypes["aptitude"];

      items.psychicPowers = itemTypes["psychicPower"];

      items.criticalInjuries = itemTypes["criticalInjury"];

      items.gear = itemTypes["gear"];
      items.drugs = itemTypes["drug"];
      items.tools = itemTypes["tool"];
      items.cybernetics = itemTypes["cybernetic"];

      items.armour = itemTypes["armour"];
      items.forceFields = itemTypes["forceField"];

      items.weapons = itemTypes["weapon"];
      items.weaponMods = itemTypes["weaponModification"];
      items.ammunitions = itemTypes["ammunition"];
      items.shipWeapons = itemTypes["shipWeapon"];
      items.portWeapons = [];
      items.starWeapons = [];
      items.dorsalWeapons = [];
      items.keelWeapons = [];
      items.prowWeapons = [];
      items.shipWeapons.forEach(wp => {
        items[`${wp.system.side}Weapons`].push(wp)
      });
      items.shipComponents = itemTypes["shipComponent"];
      const componentClasses = ["voidEngine", "warpEngine", "gellarField", "voidShield", "bridge", "lifeSupport", "crewQuarters", "augurArrays"];
      const itemsByClass = {};
      for (const componentClass of componentClasses) {
        itemsByClass[componentClass] = items.shipComponents.find(cp => cp.system.class === componentClass);
      }
      items.supplemental = items.shipComponents.filter(cp => cp.system.class === "supplemental");    
      // Access the items using the respective keys
      items.voidEngine = itemsByClass["voidEngine"];
      items.warpEngine = itemsByClass["warpEngine"];
      items.gellarField = itemsByClass["gellarField"];
      items.voidShield = itemsByClass["voidShield"];
      items.bridge = itemsByClass["bridge"];
      items.lifeSupport = itemsByClass["lifeSupport"];
      items.crewQuarters = itemsByClass["crewQuarters"];
      items.augurArrays = itemsByClass["augurArrays"];
      this._sortItemLists(items)
      return items;
  }

    _sortItemLists(items) {
        for (let list in items) {
            if (Array.isArray(items[list]))
                items[list] = items[list].sort((a, b) => a.sort - b.sort)
            else if (typeof items[list] == "object")
                this._sortItemLists(items[list])
        }
    }
}
