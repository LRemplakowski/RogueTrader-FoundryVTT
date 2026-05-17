import RogueTraderSystemModel from "../system-model.mjs";

export default class BaseItemModel extends RogueTraderSystemModel {
    static defineSchema() {
        const schema = {};

        schema.description = new HtmlField({ blank: true, initial: "" });

        schema.source = new StringField({ blank: true, initial: "" });
        schema.availability = new StringField({ blank: true, initial: "" });
        schema.weight = new NumberField({ initial: 0 });
        schema.cost = new StringField({ blank: true, initial: "" });
        schema.quantity = new NumberField({ initial: 0, integer: true });
        schema.shortDescription = new StringField({ blank: true, initial: "" });
        schema.special = new StringField({ blank: true, initial: "" });

        schema.upgrades = new StringField({ blank: true, initial: "" });
        schema.prerequisite = new StringField({ blank: true, initial: "" });
        schema.prerequisites = new StringField({ blank: true, initial: "" });
        schema.aptitudes = new StringField({ blank: true, initial: "" });
        schema.benefit = new StringField({ blank: true, initial: "" });
        schema.tier = new NumberField({ initial: 0, integer: true });
        schema.action = new StringField({ blank: true, initial: "" });
        schema.focusPower = new SchemaField({
            difficulty: new NumberField({ initial: 0, integer: true }),
            test: new StringField({ blank: true, initial: "" })
        });
        schema.range = new StringField({ blank: true, initial: "" });
        schema.sustained = new StringField({ blank: true, initial: "" });
        schema.damage = new SchemaField({
            formula: new StringField({ blank: true, initial: "" }),
            type: new StringField({ blank: true, initial: "" }),
            penetration: new StringField({ blank: true, initial: "" }),
            zone: new StringField({ blank: true, initial: "" }),
            special: new StringField({ blank: true, initial: "" })
        });
        schema.damageType = new StringField({ blank: true, initial: "" });
        schema.clip = new SchemaField({
            value: new NumberField({ initial: 0, integer: true }),
            max: new NumberField({ initial: 0, integer: true })
        });
        schema.reload = new StringField({ blank: true, initial: "" });
        schema.attack = new NumberField({ initial: 0, integer: true });
        schema.strength = new NumberField({ initial: 0, integer: true });
        schema.critRating = new NumberField({ initial: 0, integer: true });
        schema.power = new NumberField({ initial: 0 });
        schema.space = new NumberField({ initial: 0 });
        schema.shipPoints = new NumberField({ initial: 0, integer: true });
        schema.side = new StringField({ blank: true, initial: "" });
        schema.installed = new BooleanField({ initial: false });
        schema.isAdditive = new BooleanField({ initial: false });
        schema.maxAgility = new NumberField({ initial: 0, integer: true });
        schema.part = new SchemaField({
            head: new NumberField({ initial: 0, integer: true }),
            leftArm: new NumberField({ initial: 0, integer: true }),
            rightArm: new NumberField({ initial: 0, integer: true }),
            body: new NumberField({ initial: 0, integer: true }),
            leftLeg: new NumberField({ initial: 0, integer: true }),
            rightLeg: new NumberField({ initial: 0, integer: true })
        });
        schema.protectionRating = new NumberField({ initial: 0 });
        schema.overloadChance = new NumberField({ initial: 0 });
        schema.usesUpgradeSlot = new BooleanField({ initial: false });
        schema.bonusSlots = new NumberField({ initial: 0, integer: true });
        schema.yearlyLoyalty = new NumberField({ initial: 0, integer: true });
        schema.yearlyProsperity = new NumberField({ initial: 0, integer: true });
        schema.yearlySecurity = new NumberField({ initial: 0, integer: true });
        schema.themes = new StringField({ blank: true, initial: "" });
        schema.amount = new NumberField({ initial: 0, integer: true });
        schema.isOrganic = new BooleanField({ initial: false });
        schema.type = new StringField({ blank: true, initial: "" });
        schema.subtype = new StringField({ blank: true, initial: "" });
        schema.class = new StringField({ blank: true, initial: "" });
        schema.craftsmanship = new StringField({ blank: true, initial: "" });

        return schema;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static LOCALIZATION_PREFIXES = ["ROGUE_TRADER.Item.base"];

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
        if (!this.modifiers) {
            this.modifiers = { characteristic: {}, skill: {}, other: {} };
        }
    }

    /* -------------------------------------------------- */

    get isInstalled() {
        return this.installed ? game.i18n.localize("Yes") : game.i18n.localize("No");
    }

    get isMentalDisorder() { return this.type === "mentalDisorder"; }
    get isMalignancy() { return this.type === "malignancy"; }
    get isMutation() { return this.type === "mutation"; }
    get isTalent() { return this.type === "talent"; }
    get isTrait() { return this.type === "trait"; }
    get isAptitude() { return this.type === "aptitude"; }
    get isSpecialAbility() { return this.type === "specialAbility"; }
    get isPsychicPower() { return this.type === "psychicPower"; }
    get isCriticalInjury() { return this.type === "criticalInjury"; }
    get isWeapon() { return this.type === "weapon"; }
    get isArmour() { return this.type === "armour"; }
    get isGear() { return this.type === "gear"; }
    get isDrug() { return this.type === "drug"; }
    get isTool() { return this.type === "tool"; }
    get isCybernetic() { return this.type === "cybernetic"; }
    get isWeaponModification() { return this.type === "weaponModification"; }
    get isAmmunition() { return this.type === "ammunition"; }
    get isForceField() { return this.type === "forceField"; }
    get isShipWeapon() { return this.type === "shipWeapon"; }
    get isShipComponent() { return this.type === "shipComponent"; }
    get isAbilities() { return this.isTalent || this.isTrait || this.isSpecialAbility; }

    get damageType() {
        return this.damageType || this.damage?.type || this.effect?.damage?.type || this.type;
    }

    get DamageTypeShort() {
        switch (this.damageType) {
            case "energy":
                return game.i18n.localize("DAMAGE_TYPE.ENERGY_SHORT");
            case "impact":
                return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
            case "rending":
                return game.i18n.localize("DAMAGE_TYPE.RENDING_SHORT");
            case "explosive":
                return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE_SHORT");
            default:
                return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
        }
    }

    get DamageType() {
        switch (this.damageType) {
            case "energy":
                return game.i18n.localize("DAMAGE_TYPE.ENERGY");
            case "impact":
                return game.i18n.localize("DAMAGE_TYPE.IMPACT");
            case "rending":
                return game.i18n.localize("DAMAGE_TYPE.RENDING");
            case "explosive":
                return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE");
            default:
                return game.i18n.localize("DAMAGE_TYPE.IMPACT");
        }
    }

    get Clip() {
        return `${this.clip?.value}/${this.clip?.max}`;
    }

    get RateOfFire() {
        const rof = this.rateOfFire || { single: 0, burst: 0, full: 0 };
        const single = rof.single > 0 ? "S" : "-";
        const burst = rof.burst > 0 ? `${rof.burst}` : "-";
        const full = rof.full > 0 ? `${rof.full}` : "-";
        return `${single}/${burst}/${full}`;
    }

    get statModifiers() {
        if (!this.modifiers) {
            this.modifiers = { characteristic: {}, skill: {}, other: {} };
        }
        return this.modifiers;
    }

    get characteristicModifiers() { return this.statModifiers.characteristic; }
    get skillModifiers() { return this.statModifiers.skill; }
    get otherModifiers() { return this.statModifiers.other; }
}
