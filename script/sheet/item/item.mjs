import {showAddCharacteristicModifierDialog, showAddSkillModifierDialog} from "../../common/dialog.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

// v13 MIGRATION: HandlebarsApplicationMixin is REQUIRED for appv2 rendering — do not remove.
// The mixin provides _renderHTML and _replaceHTML implementations that DocumentSheetV2 needs.
// ItemSheetV2 provides DocumentSheetV2 base with automatic form submission
// for inputs with name="system.*" attributes
export default class RogueTraderItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
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
			width: 540,
			height: 440
		},
	};

	static METADATA = { 
		types: [],
		makeDefault: true,
	}

	// v13 MIGRATION: PARTS defines the main template structure
	// DocumentSheetV2 automatically renders PARTS and handles form submission
	static PARTS = {
		...super.PARTS,
		sheet: {
			label: "TITLE.NAME",
			template: "systems/rogue-trader/template/sheet/item/item.html"
		},
	};

	static TABS = {
		primary: {
			tabs: [
				{
					id: "notes",
					group: "primary",
					label: "TAB.NOTES",
					icon: "fa-solid fa-shield",
					cssClass: "tab-combat"
				},
			],
			initial: "notes"
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
	 * Persist the currently active tab across renders.
	 */
	activeTab = this.constructor.TABS?.primary?.initial;

	/**
	* Capture tab clicks so the sheet remembers the last selected tab.
	* AppV2 dispatches tab clicks into _onClickTab; store the id for later restoration.
	*/
	_onClickTab(event, target) {
		// Let the base class handle the actual activation logic first
		super._onClickTab(event, target);

		// Store the selected tab id so it can be restored after re-render
		if (target?.dataset?.tab) {
			this.activeTab = target.dataset.tab;
		}
	}

	_prepareTabs(key) {
		const tabs = super._prepareTabs(key);
		for (const [key, tab] of Object.entries(tabs)) {
			tab.partial = `systems/rogue-trader/template/sheet/item/tab/${tab.id}.html`;
			tab.system = this.document.system;
			tab.item = this.document;
		}
		return tabs;
	}

	/** @inheritdoc */
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		
		// Add 'item' alias for template backward compatibility (templates expect item.name, item.img, etc)
		context.item = this.document;
		
		const systemData = context.document.system;
		context.title = game.i18n.localize(this.constructor?.PARTS?.sheet.label);
		context.tabs = this._prepareTabs("primary");
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
				{value: 'voidEngine', label: game.i18n.localize('SHIP_ITEM.VOID_ENGINE')},
				{value: 'warpEngine', label: game.i18n.localize('SHIP_ITEM.WARP_ENGINE')},
				{value: 'gellarField', label: game.i18n.localize('SHIP_ITEM.GELLAR_FIELD')},
				{value: 'voidShield', label: game.i18n.localize('SHIP_ITEM.VOID_SHIELD')},
				{value: 'bridge', label: game.i18n.localize('SHIP_ITEM.BRIDGE')},
				{value: 'lifeSupport', label: game.i18n.localize('SHIP_ITEM.LIFE_SUPPORT')},
				{value: 'crewQuarters', label: game.i18n.localize('SHIP_ITEM.CREW_QUARTERS')},
				{value: 'augurArray', label: game.i18n.localize('SHIP_ITEM.AUGUR_ARRAY')},
				{value: 'supplemental', label: game.i18n.localize('SHIP_ITEM.SUPPLEMENTAL')}
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
