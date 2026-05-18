import RogueTraderSystemModel from "../system-model.mjs";

const { HTMLField } = foundry.data.fields;

export default class BaseItemModel extends RogueTraderSystemModel {
    static defineSchema() {
        const schema = {};
        schema.description = new HtmlField({ blank: true, initial: "" });
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
    }

    /* -------------------------------------------------- */

    // get isInstalled() {
    //     return this.installed ? game.i18n.localize("Yes") : game.i18n.localize("No");
    // }

    // get isMentalDisorder() { return this.type === "mentalDisorder"; }
    // get isMalignancy() { return this.type === "malignancy"; }
    // get isMutation() { return this.type === "mutation"; }
    // get isTalent() { return this.type === "talent"; }
    // get isTrait() { return this.type === "trait"; }
    // get isAptitude() { return this.type === "aptitude"; }
    // get isSpecialAbility() { return this.type === "specialAbility"; }
    // get isPsychicPower() { return this.type === "psychicPower"; }
    // get isCriticalInjury() { return this.type === "criticalInjury"; }
    // get isWeapon() { return this.type === "weapon"; }
    // get isArmour() { return this.type === "armour"; }
    // get isGear() { return this.type === "gear"; }
    // get isDrug() { return this.type === "drug"; }
    // get isTool() { return this.type === "tool"; }
    // get isCybernetic() { return this.type === "cybernetic"; }
    // get isWeaponModification() { return this.type === "weaponModification"; }
    // get isAmmunition() { return this.type === "ammunition"; }
    // get isForceField() { return this.type === "forceField"; }
    // get isShipWeapon() { return this.type === "shipWeapon"; }
    // get isShipComponent() { return this.type === "shipComponent"; }
    // get isAbilities() { return this.isTalent || this.isTrait || this.isSpecialAbility; }

    // get damageType() {
    //     return this.damageType || this.damage?.type || this.effect?.damage?.type || this.type;
    // }

    // get DamageTypeShort() {
    //     switch (this.damageType) {
    //         case "energy":
    //             return game.i18n.localize("DAMAGE_TYPE.ENERGY_SHORT");
    //         case "impact":
    //             return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
    //         case "rending":
    //             return game.i18n.localize("DAMAGE_TYPE.RENDING_SHORT");
    //         case "explosive":
    //             return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE_SHORT");
    //         default:
    //             return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
    //     }
    // }

    // get DamageType() {
    //     switch (this.damageType) {
    //         case "energy":
    //             return game.i18n.localize("DAMAGE_TYPE.ENERGY");
    //         case "impact":
    //             return game.i18n.localize("DAMAGE_TYPE.IMPACT");
    //         case "rending":
    //             return game.i18n.localize("DAMAGE_TYPE.RENDING");
    //         case "explosive":
    //             return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE");
    //         default:
    //             return game.i18n.localize("DAMAGE_TYPE.IMPACT");
    //     }
    // }

    // get Clip() {
    //     return `${this.clip?.value}/${this.clip?.max}`;
    // }

    // get RateOfFire() {
    //     const rof = this.rateOfFire || { single: 0, burst: 0, full: 0 };
    //     const single = rof.single > 0 ? "S" : "-";
    //     const burst = rof.burst > 0 ? `${rof.burst}` : "-";
    //     const full = rof.full > 0 ? `${rof.full}` : "-";
    //     return `${single}/${burst}/${full}`;
    // }

    // get statModifiers() {
    //     if (!this.modifiers) {
    //         this.modifiers = { characteristic: {}, skill: {}, other: {} };
    //     }
    //     return this.modifiers;
    // }

    // get characteristicModifiers() { return this.statModifiers.characteristic; }
    // get skillModifiers() { return this.statModifiers.skill; }
    // get otherModifiers() { return this.statModifiers.other; }
}
