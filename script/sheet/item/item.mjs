import {showAddCharacteristicModifierDialog, showAddSkillModifierDialog} from "../../common/dialog.js";
import * as enums from "../../data/enums/_module.mjs";
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

	_preapareDropdownOptions() {
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
			skillsOptions: enums.Skills.options(true),
			weaponClassOptions: enums.WeaponClass.options(),
			weaponTypeOptions: enums.WeaponType.options()
		};
		return result;
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
		const optionsData = this._preapareDropdownOptions();

		// Return context including options for selectOptions helper
		context.options = {
			...(context.options || {}),
			...optionsData
		};
		context.system = systemData; // Provide direct access to system data for templates
		return context;
	}
}
