import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll, prepareForceFieldRoll } from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import * as enums from "../../data/enums/_module.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

// v13 MIGRATION: HandlebarsApplicationMixin is REQUIRED for appv2 rendering — do not remove.
// The mixin provides _renderHTML and _replaceHTML implementations that DocumentSheetV2 needs.
// ActorSheetV2 provides DocumentSheetV2 base with automatic form submission
// for inputs with name="system.*" attributes
export default class RogueTraderSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property instead of defaultOptions getter
  // Subclasses will override this with their specific configuration
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "rogue-trader-sheet",
    classes: ["rogue-trader", "sheet", "actor"],
    tag: "form",
    form: {
      handler: RogueTraderSheet.#onSubmitForm,
      closeOnSubmit: false,
      submitOnChange: true
    },
    window: {
      resizable: true
    },
    position: {
      width: 720,
      height: 881
    },
    actions: {
      itemCreate: RogueTraderSheet.#itemCreate,
      itemEdit: RogueTraderSheet.#itemEdit,
      itemDelete: RogueTraderSheet.#itemDelete,
      rollCharacteristic: RogueTraderSheet.#rollCharacteristic,
      rollSkill: RogueTraderSheet.#rollSkill,
      rollSpeciality: RogueTraderSheet.#rollSpeciality,
      rollInsanity: RogueTraderSheet.#rollInsanity,
      rollCorruption: RogueTraderSheet.#rollCorruption,
      rollWeapon: RogueTraderSheet.#rollWeapon,
      rollForceField: RogueTraderSheet.#rollForceField,
      rollPsychicPower: RogueTraderSheet.#rollPsychicPower
    }
  };

  // v13 MIGRATION: PARTS defines the main template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/actor.html"
    }
  };

  static METADATA = { 
    types: [],
    makeDefault: true,
  }

  /**
   * Handle form submission for the actor sheet.
   * @this {RogueTraderSheet}
   * @param {SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   */
  static async #onSubmitForm(event, form, formData) {
    event.preventDefault();
    await this.document.update(formData.object);
  }

  /**
   * Handle item creation.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemCreate(event, target) {
    event.preventDefault();
    let header = target.dataset;
    let data = {
      name: `New ${game.i18n.localize(`TYPES.Item.${this.camelCase(header.type)}`)}`,
      type: header.type
    };
    this.document.createEmbeddedDocuments("Item", [data], { renderSheet: true });
  }

  /**
   * Handle item edit.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemEdit(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    let item = this.document.items.get(div.dataset.itemId);
    item.sheet.render({ force: true });
  }

  /**
   * Handle item deletion.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemDelete(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    this.document.deleteEmbeddedDocuments("Item", [div.dataset.itemId]);
  }

  /**
   * Handle characteristic roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollCharacteristic(event, target) {
    event.preventDefault();
    const characteristicName = target.dataset.characteristic;
    const characteristic = this.document.characteristics[characteristicName];
    const rollData = {
      name: characteristic.label,
      baseTarget: characteristic.total,
      modifier: 0,
      ownerId: this.document.id,
      unnatural: characteristic.unnatural
    };
    await prepareCommonRoll(rollData);
  }

  /**
   * Handle skill roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollSkill(event, target) {
    event.preventDefault();
    const skillName = target.dataset.skill;
    const skill = this.document.skills[skillName];
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
      ownerId: this.document.id,
      unnatural: 0
    };
    await prepareCommonRoll(rollData);
  }

  /**
   * Handle speciality roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollSpeciality(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const skillName = div.dataset.skill;
    const specialityName = target.dataset.speciality;
    const skill = this.document.skills[skillName];
    const speciality = skill.specialities[specialityName];
    const rollData = {
      name: speciality.label,
      baseTarget: speciality.total,
      modifier: 0,
      ownerId: this.document.id
    };
    await prepareCommonRoll(rollData);
  }

  /**
   * Handle insanity roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollInsanity(event, target) {
    event.preventDefault();
    const characteristic = this.document.characteristics.willpower;
    const rollData = {
      name: "FEAR.HEADER",
      baseTarget: characteristic.total,
      modifier: 0,
      ownerId: this.document.id
    };
    await prepareCommonRoll(rollData);
  }

  /**
   * Handle corruption roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollCorruption(event, target) {
    event.preventDefault();
    const characteristic = this.document.characteristics.willpower;
    const rollData = {
      name: "CORRUPTION.HEADER",
      baseTarget: characteristic.total,
      modifier: this._getCorruptionModifier(),
      ownerId: this.document.id
    };
    await prepareCommonRoll(rollData);
  }

  /**
   * Handle weapon roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollWeapon(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const weapon = this.document.items.get(div.dataset.itemId);
    await prepareCombatRoll(
      RogueTraderUtil.createWeaponRollData(this.document, weapon), 
      this.document
    );
  }

  /**
   * Handle force field roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollForceField(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const forceField = this.document.items.get(div.dataset.itemId);
    await prepareForceFieldRoll(
      RogueTraderUtil.createForceFieldRollData(this.document, forceField),
      this.document
    );
  }

  /**
   * Handle psychic power roll.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollPsychicPower(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const psychicPower = this.document.items.get(div.dataset.itemId);    
    await preparePsychicPowerRoll(
      RogueTraderUtil.createPsychicRollData(this.document, psychicPower)
    );
  }

  // v13 MIGRATION: ApplicationV2 activation - activateListeners is still needed for non-action event binding
  // This method is called after rendering and must handle all custom event listeners.
  // Call super.activateListeners(html) to ensure parent class event binding occurs first.
  activateListeners(html) {
    // v13 MIGRATION: CRITICAL - Call super first to ensure ApplicationV2 form binding works
    super.activateListeners(html);
    
    // v13 MIGRATION: Input focus handlers for auto-select
    html.querySelectorAll("input").forEach(el => {
      el.addEventListener("focusin", ev => this._onFocusIn(ev));
    });
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.document.isOwner) {
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

  camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  _onFocusIn(event) {
    event.currentTarget.select();
  }

  async _prepareCustomRoll() {
    const rollData = {
      name: "DIALOG.CUSTOM_ROLL",
      baseTarget: 50,
      modifier: 0,
      ownerId: this.document.id
    };
    await prepareCommonRoll(rollData);
  }

  _getCharacteristicOptions(selected) {
    const characteristics = [];
    for (let char of Object.values(this.document.characteristics)) {
      characteristics.push({
        label: char.label,
        target: char.total,
        selected: char.short === selected,
        unnatural: char.unnatural
      });
    }
    return characteristics;
  }

  _getMaxPsyRating() {
    let base = this.document.psy.rating;
    switch (this.document.psy.class) {
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
    for (let list in this.document.items) {
      switch (modType) {
        case 'characteristic':
          for (let itemType in this.document.items[list]) {
            let items = this.document.items[list][itemType];
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
          for (let itemType in this.document.items[list]) {
            let items = this.document.items[list][itemType];
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
    const corruption = this.document.corruption;
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
      return this.document.characteristics.weaponSkill;
    } else {
      return this.document.characteristics.ballisticSkill;
    }
  }

  _getFocusPowerTarget(psychicPower) {
    const normalizeName = psychicPower.focusPower.test.toLowerCase();
    if (this.document.characteristics.hasOwnProperty(normalizeName)) {
      return this.document.characteristics[normalizeName];
    } else if (this.document.skills.hasOwnProperty(normalizeName)) {
      return this.document.skills[normalizeName];
    } else {
      return this.document.characteristics.willpower;
    }
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  // This method prepares the context object passed to the Handlebars template
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Add 'actor' alias for template backward compatibility (templates expect actor.name, actor.img, etc)
    context.actor = this.document;
    
    // Add system data for template access
    context.system = this.document.system;
    context.items = this.constructItemLists(context);

    const rawTabs = this.constructor.TABS.primary.tabs.map(t => ({
      ...t,
      partial: `systems/rogue-trader/template/sheet/actor/tab/${t.id}.html`,
      active: t.id === this.constructor.TABS.primary.initial,
      system: context.system,
      items: context.items,
      actor: context.actor
    }));

    // Remove any inherited enumerable properties (like "primary")
    context.tabs = rawTabs;

    // Provide reusable option lists for actor templates using selectOptions
    const optionsData = {
      craftsmanshipOptions: enums.Craftsmanship.options(),
      availabilityOptions: enums.Availability.options(),
      damageTypeOptions: enums.DamageType.options(),
      shipWeaponClassOptions: enums.ShipWeaponClass.options(),
      armourTypeOptions: enums.ArmourType.options(),
      criticalInjuryPartOptions: enums.HitLocations.options(),
      // Crew skill options for ship actor templates
      crewSkillOptions: enums.CrewSkill.options(),
      // Characteristic advance options
      characteristicAdvanceOptions: enums.CharacteristicAdvance.options(),
      // NPC type options
      npcTypeOptions: enums.NPCType.options(),
      // Skill/speciality advance options
      skillAdvanceOptions: enums.SkillAdvance.options(),
      // Psychic class options
      psyClassOptions: enums.PsyClass.options(),
      initiativeOptions: enums.Characteristics.options(),
      governorTypeOptions: enums.GovernorType.options(),
      colonyTypeOptions: enums.ColonyType.options(),
      hullClassOptions: enums.HullClass.options(),
    };

    // Merge options with any existing options and attach to context
    context.options = {
      ...(context.options || {}),
      ...optionsData
    };

    return context;
  }

  constructItemLists() {
      let items = {}
      let itemTypes = this.document.itemTypes;
      items.mentalDisorders = itemTypes["mentalDisorder"];
      items.malignancies = itemTypes["malignancy"];
      items.mutations = itemTypes["mutation"];
      if (this.document.type === "npc") {
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
