import {showAddCharacteristicModifierDialog, showAddSkillModifierDialog} from "../common/dialog.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

// v13 MIGRATION: HandlebarsApplicationMixin is REQUIRED for appv2 rendering — do not remove.
// The mixin provides _renderHTML and _replaceHTML implementations that DocumentSheetV2 needs.
// ItemSheetV2 provides DocumentSheetV2 base with automatic form submission
// for inputs with name="system.*" attributes
export class RogueTraderItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property instead of defaultOptions getter
  // Subclasses will override this with their specific template and configuration
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    id: "rogue-trader-item-sheet",
    classes: ["rogue-trader", "sheet", "item"],
    tag: "form",
    form: {
      handler: RogueTraderItemSheet.#onSubmitForm,
      closeOnSubmit: false,
      submitOnChange: true
    },
    window: {
      resizable: true
    },
    position: {
      width: 500,
      height: 400
    },
    actions: {
      addCharModifier: RogueTraderItemSheet.#addCharModifier,
      addSkillModifier: RogueTraderItemSheet.#addSkillModifier,
      deleteModifier: RogueTraderItemSheet.#deleteModifier
    }
  };

  // v13 MIGRATION: PARTS defines the main template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/item.html"
    }
  };

  /**
   * Handle form submission for the item sheet.
   * @this {RogueTraderItemSheet}
   * @param {SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   */
  static async #onSubmitForm(event, form, formData) {
    event.preventDefault();
    await this.document.update(formData.object);
  }

  /**
   * Handle adding a characteristic modifier.
   * @this {RogueTraderItemSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #addCharModifier(event, target) {
    event.preventDefault();
    const modifierType = target.dataset.type;
    showAddCharacteristicModifierDialog(this, modifierType);
  }

  /**
   * Handle adding a skill modifier.
   * @this {RogueTraderItemSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #addSkillModifier(event, target) {
    event.preventDefault();
    const modifierType = target.dataset.type;
    showAddSkillModifierDialog(this, modifierType);
  }

  /**
   * Handle deleting a modifier.
   * @this {RogueTraderItemSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #deleteModifier(event, target) {
    event.preventDefault();
    const div = target.closest(".modifier-item");
    const modId = div.dataset.modifierId;
    const modKey = div.dataset.modifierKey;
    const itemData = this.document.system;
    delete itemData.modifiers[modId][modKey];
    await this.document.update({ [`system.modifiers.${modId}.-=${modKey}`]: null });
    console.log(`Modifier removed: ${modId} - ${modKey}`);
  }

  // v13 MIGRATION: ApplicationV2 activation - activateListeners is still needed for non-action event binding
  // This method is called after rendering and handles subscription-based change events.
  // Call super.activateListeners(html) to ensure parent class event binding occurs first.
  activateListeners(html) {
    // v13 MIGRATION: CRITICAL - Call super first to ensure ApplicationV2 form binding works
    super.activateListeners(html);
    
    // v13 MIGRATION: Input focus handlers for auto-select
    html.querySelectorAll("input").forEach(el => {
      el.addEventListener("focusin", ev => this._onFocusIn(ev));
    });

    // v13 MIGRATION: Subscribe to modifier changes
    // The { modifiers } destructuring accesses system.modifiers from the rendered document
    const { modifiers } = this.document.system;
    for (const category in modifiers) {
      if (modifiers.hasOwnProperty(category)) {
        for (const key in modifiers[category]) {
          if (modifiers[category].hasOwnProperty(key)) {  
            // Determine which handler to use based on the category
            switch (category) {
              case 'characteristic':
                this._subscribeCharacteristicChange(html, category, key);
                break;
              case 'skill':
                this._subscribeSkillChange(html, category, key);
                break;
              case 'other':
                // Attach other-specific change handlers
                break;
              // Add more cases as needed for additional categories
            }
          }
        }
      }
    }
  }

  _subscribeCharacteristicChange(html, category, key) {
    const charModInputField = html.querySelector(`input[id='modifier-char-value-${key}']`);
    const unnaturalModInputField = html.querySelector(`input[id='modifier-unnatural-value-${key}']`);
    const charModLabel = html.querySelector(`a[id='modifier-char-label-${key}']`);
    charModInputField?.addEventListener("change", () => this._onCharacteristicModifierChange(category, key, charModLabel, charModInputField, unnaturalModInputField));
    unnaturalModInputField?.addEventListener("change", () => this._onCharacteristicModifierChange(category, key, charModLabel, charModInputField, unnaturalModInputField));
  }

  _subscribeSkillChange(html, category, key) {
    const skillModInputField = html.querySelector(`input[id='modifier-skill-value-${key}']`);
    const skillModLabel = html.querySelector(`a[id='modifier-skill-label-${key}']`);
    skillModInputField?.addEventListener("change", () => this._onSkillModifierChange(category, key, skillModLabel, skillModInputField));
  }
  
  _onCharacteristicModifierChange(category, key, labelElement, charValueField, unnaturalValueField) {
    const charValue = parseInt(charValueField.value, 10);
    const unnaturalValue = parseInt(unnaturalValueField.value, 10);
    const modifierData = {
      id: key,
      label: labelElement.dataset.modifierLabel,
      characteristicModifier: charValue,
      unnaturalModifier: unnaturalValue
    };
    this.addModifier(category, key, modifierData);
  }

  _onSkillModifierChange(category, key, labelElement, skillValueField) {
    const skillValue = parseInt(skillValueField.value, 10);
    const modifierData = {
      id: key,
      label: labelElement.dataset.modifierLabel,
      skillModifier: skillValue,
    }
    this.addModifier(category, key, modifierData);
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: game.i18n.localize("BUTTON.POST_ITEM"),
        class: "item-post",
        icon: "fas fa-comment",
        onclick: ev => this.document.sendToChat()
      }
    ].concat(buttons);
    return buttons;
  }

  _onFocusIn(event) {
    event.currentTarget.select();
  }

  /**
   * Adds a new modifier to the item.
   * @param {string} modifierType - The type of the modifier ('characteristic', 'skill', 'other').
   * @param {string} attributeName - The name of the affected attribute.
   * @param {object} modifierData - The value of the modifier to add.
   */
  addModifier(modifierType, attributeName, modifierData) {
    // Ensure the modifier type is valid
    if (!['characteristic', 'skill', 'other'].includes(modifierType)) {
      console.error('Invalid modifier type. Must be "characteristic", "skill", or "other".');
      return;
    }
    // Directly access the item's data
    const itemData = this.document.system;
    // Initialize the modifiers object if it doesn't exist
    if (!itemData.modifiers) {
      itemData.modifiers = { characteristic: {}, skill: {}, other: {} };
    }
    // Set the new modifier value
    itemData.modifiers[modifierType][attributeName] = modifierData;
    // Update the item with the new modifier
    this.document.update({ 'system.modifiers': itemData.modifiers }).then(() => {
      console.log(`Modifier added: ${modifierType} - ${attributeName}: ${modifierData}`);
    }).catch(err => {
      console.error('Error updating item with new modifier:', err);
    });
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  // This method prepares the context object passed to the Handlebars template
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Add 'item' alias for template backward compatibility (templates expect item.name, item.img, etc)
    context.item = this.document;
    
    const systemData = context.document.system;
    
    // Item HTML enrichment
    context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.document.description,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    // Component HTML enrichment
    context.essentialComponentsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      systemData.essentialComponents,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.supplementalComponentsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      systemData.supplementalComponents,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.complicationsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      systemData.complications,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.pastHistoryHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      systemData.pastHistory,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.weaponsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      systemData.weapons,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );

    // Provide reusable option lists for templates using selectOptions
    const optionsData = {
      weaponClassOptions: [
        {value: 'melee', label: game.i18n.localize('WEAPON.MELEE')},
        {value: 'thrown', label: game.i18n.localize('WEAPON.THROWN')},
        {value: 'pistol', label: game.i18n.localize('WEAPON.PISTOL')},
        {value: 'basic', label: game.i18n.localize('WEAPON.BASIC')},
        {value: 'heavy', label: game.i18n.localize('WEAPON.HEAVY')},
        {value: 'launched', label: game.i18n.localize('WEAPON.LAUNCHED')},
        {value: 'placed', label: game.i18n.localize('WEAPON.PLACED')},
        {value: 'vehicle', label: game.i18n.localize('WEAPON.VEHICLE')}
      ],
      weaponTypeOptions: [
        {value: 'las', label: game.i18n.localize('WEAPON.LAS')},
        {value: 'solidprojectile', label: game.i18n.localize('WEAPON.SOLIDPROJECTILE')},
        {value: 'bolt', label: game.i18n.localize('WEAPON.BOLT')},
        {value: 'melta', label: game.i18n.localize('WEAPON.MELTA')},
        {value: 'plasma', label: game.i18n.localize('WEAPON.PLASMA')},
        {value: 'flame', label: game.i18n.localize('WEAPON.FLAME')},
        {value: 'lowtech', label: game.i18n.localize('WEAPON.LOWTECH')},
        {value: 'launcher', label: game.i18n.localize('WEAPON.LAUNCHER')},
        {value: 'explosive', label: game.i18n.localize('WEAPON.EXPLOSIVE')},
        {value: 'exotic', label: game.i18n.localize('WEAPON.EXOTIC')},
        {value: 'chain', label: game.i18n.localize('WEAPON.CHAIN')},
        {value: 'power', label: game.i18n.localize('WEAPON.POWER')},
        {value: 'shock', label: game.i18n.localize('WEAPON.SHOCK')},
        {value: 'force', label: game.i18n.localize('WEAPON.FORCE')}
      ],
      damageTypeOptions: [
        {value: 'energy', label: game.i18n.localize('DAMAGE_TYPE.ENERGY')},
        {value: 'impact', label: game.i18n.localize('DAMAGE_TYPE.IMPACT')},
        {value: 'rending', label: game.i18n.localize('DAMAGE_TYPE.RENDING')},
        {value: 'explosive', label: game.i18n.localize('DAMAGE_TYPE.EXPLOSIVE')}
      ],
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
      damageZoneOptions: [
        {value: 'none', label: game.i18n.localize('ATTACK_TYPE.NONE')},
        {value: 'bolt', label: game.i18n.localize('PSYCHIC_POWER.BOLT')},
        {value: 'barrage', label: game.i18n.localize('PSYCHIC_POWER.BARRAGE')},
        {value: 'storm', label: game.i18n.localize('PSYCHIC_POWER.STORM')},
        {value: 'blast', label: game.i18n.localize('PSYCHIC_POWER.BLAST')}
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
      shipComponentClassOptions: [
        {value: 'voidEngine', label: game.i18n.localize('SHIP_COMPONENT.VOID_ENGINE')},
        {value: 'warpEngine', label: game.i18n.localize('SHIP_COMPONENT.WARP_ENGINE')},
        {value: 'gellarField', label: game.i18n.localize('SHIP_COMPONENT.GELLAR_FIELD')},
        {value: 'voidShield', label: game.i18n.localize('SHIP_COMPONENT.VOID_SHIELD')},
        {value: 'bridge', label: game.i18n.localize('SHIP_COMPONENT.BRIDGE')},
        {value: 'lifeSupport', label: game.i18n.localize('SHIP_COMPONENT.LIFE_SUPPORT')},
        {value: 'crewQuarters', label: game.i18n.localize('SHIP_COMPONENT.CREW_QUARTERS')},
        {value: 'augurArrays', label: game.i18n.localize('SHIP_COMPONENT.AUGUR_ARRAYS')},
        {value: 'supplemental', label: game.i18n.localize('SHIP_COMPONENT.SUPPLEMENTAL')}
      ]
    };

    // Return context including options for selectOptions helper
    context.options = {
      ...(context.options || {}),
      ...optionsData
    };
    context.system = systemData; // Provide direct access to system data for templates
    return context;
  }
}
