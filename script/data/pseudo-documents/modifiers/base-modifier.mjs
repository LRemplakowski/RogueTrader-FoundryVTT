import PseudoDocument from "../pseudo-document.mjs";

export default class BaseModifier extends PseudoDocument {
    static get metadata() {
        const metadata = super.metadata;
        metadata.documentName = "baseModifier";
        return metadata;
    }
}