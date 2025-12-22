import {showAddCharacteristicModifierDialog, showAddSkillModifierDialog} from "../common/dialog.js";

export class RogueTraderItemSheet extends ItemSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input").focusin(ev => this._onFocusIn(ev));
    html.find('.add-char-modifier').click(event => {
      const button = $(event.currentTarget);
      const modifierType = button.data('type');
      // Call a method to show a form or dialog to input new modifier details
      showAddCharacteristicModifierDialog(this, modifierType);
    });
    html.find('.add-skill-modifier').click(event => {
      const button = $(event.currentTarget);
      const modifierType = button.data('type');
      showAddSkillModifierDialog(this, modifierType);
    });
    html.find(".item-delete").click(ev => this._onModifierDelete(ev));

    const { modifiers } = this.object.system;
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
    const charModInputField = html.find(`input[id='modifier-char-value-${key}']`);
    const unnaturalModInputField = html.find(`input[id='modifier-unnatural-value-${key}']`);
    const charModLabel = html.find(`a[id='modifier-char-label-${key}']`);
    charModInputField.change(() => this._onCharacteristicModifierChange(category, key, charModLabel, charModInputField, unnaturalModInputField));
    unnaturalModInputField.change(() => this._onCharacteristicModifierChange(category, key, charModLabel, charModInputField, unnaturalModInputField));
  }

  _subscribeSkillChange(html, category, key) {
    const skillModInputField = html.find(`input[id='modifier-skill-value-${key}']`);
    const skillModLabel = html.find(`a[id='modifier-skill-label-${key}']`);
    skillModInputField.change(() => this._onSkillModifierChange(category, key, skillModLabel, skillModInputField));
  }
  
  _onCharacteristicModifierChange(category, key, labelElement, charValueField, unnaturalValueField) {
    const charValue = parseInt(charValueField.val(), 10);
    const unnaturalValue = parseInt(unnaturalValueField.val(), 10);
    const modifierData = {
      id: key,
      label: labelElement.data('modifier-label'),
      characteristicModifier: charValue,
      unnaturalModifier: unnaturalValue
    };
    this.addModifier(category, key, modifierData);
  }

  _onSkillModifierChange(category, key, labelElement, skillValueField) {
    const skillValue = parseInt(skillValueField.val(), 10);
    const modifierData = {
      id: key,
      label: labelElement.data('modifier-label'),
      skillModifier: skillValue,
    }
    this.addModifier(category, key, modifierData);
  }
  
  async getData(options) {
    let data = super.getData(options);
        // Item HTML enrichment
    data.item.descriptionHTML = await TextEditor.enrichHTML(
      data.item.description,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    // Component HTML enrichment
    data.data.system.essentialComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.essentialComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.supplementalComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.supplementalComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.complicationsHTML = await TextEditor.enrichHTML(
      data.data.system.complications,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.pastHistoryHTML = await TextEditor.enrichHTML(
      data.data.system.pastHistory,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.weaponsHTML = await TextEditor.enrichHTML(
      data.data.system.weapons,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
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

      // Ship weapon classes (used by shipWeapon templates)
      shipWeaponClassOptions: [
        {value: 'macro', label: game.i18n.localize('SHIP_WEAPON.MACRO')},
        {value: 'lance', label: game.i18n.localize('SHIP_WEAPON.LANCE')},
        {value: 'torpedo', label: game.i18n.localize('SHIP_WEAPON.TORPEDO')},
        {value: 'hangar', label: game.i18n.localize('SHIP_WEAPON.HANGAR')}
      ],

      // Armour types
      armourTypeOptions: [
        {value: 'basic', label: game.i18n.localize('ARMOUR_TYPE.BASIC')},
        {value: 'flak', label: game.i18n.localize('ARMOUR_TYPE.FLAK')},
        {value: 'mesh', label: game.i18n.localize('ARMOUR_TYPE.MESH')},
        {value: 'carapace', label: game.i18n.localize('ARMOUR_TYPE.CARAPACE')},
        {value: 'power', label: game.i18n.localize('ARMOUR_TYPE.POWER')},
        {value: 'other', label: game.i18n.localize('ARMOUR_TYPE.OTHER')}
      ],

      // Critical injury parts
      criticalInjuryPartOptions: [
        {value: 'head', label: game.i18n.localize('ARMOUR.HEAD')},
        {value: 'leftArm', label: game.i18n.localize('ARMOUR.LEFT_ARM')},
        {value: 'rightArm', label: game.i18n.localize('ARMOUR.RIGHT_ARM')},
        {value: 'body', label: game.i18n.localize('ARMOUR.BODY')},
        {value: 'leftLeg', label: game.i18n.localize('ARMOUR.LEFT_LEG')},
        {value: 'rightLeg', label: game.i18n.localize('ARMOUR.RIGHT_LEG')}
      ],

      // Ship component classes
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
    return {
      item: data.item,
      system: data.data.system,
      options: optionsData
    };
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: game.i18n.localize("BUTTON.POST_ITEM"),
        class: "item-post",
        icon: "fas fa-comment",
        onclick: ev => this.item.sendToChat()
      }
    ].concat(buttons);
    return buttons;
  }

  _onFocusIn(event) {
    $(event.currentTarget).select();
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
    const itemData = this.object.system;
    // Initialize the modifiers object if it doesn't exist
    if (!itemData.modifiers) {
      itemData.modifiers = { characteristic: {}, skill: {}, other: {} };
    }
    // Set the new modifier value
    itemData.modifiers[modifierType][attributeName] = modifierData;
    // Update the item with the new modifier
    this.object.update({ 'system.modifiers': itemData.modifiers }).then(() => {
      console.log(`Modifier added: ${modifierType} - ${attributeName}: ${modifierData}`);
    }).catch(err => {
      console.error('Error updating item with new modifier:', err);
    });
  }

  _onModifierDelete(event) { 
    event.preventDefault();
    const div = $(event.currentTarget).parents(".modifier-item");
    const modId = div.data("modifierId");
    const modKey = div.data("modifierKey");
    const itemData = this.object.system;
    delete itemData.modifiers[modId][modKey];
    this.object.update({ [`system.modifiers.${modId}.-=${modKey}`]: null }).then(() => {
      console.log(`Modifier removed: ${modId} - ${modKey}`);
    }).catch(err => {
      console.error('Error updating item with deleted modifier:', err);
    });
    div.slideUp(200, () => this.render(false));
  }
}
