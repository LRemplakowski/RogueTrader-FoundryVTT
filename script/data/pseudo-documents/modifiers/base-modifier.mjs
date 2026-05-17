import PseudoDocument from "../pseudo-document.mjs";

export default class BaseModifier extends PseudoDocument {
    static metadata() {
        const metadata = super.metadata();
        metadata.documentName = "baseModifier";
        return metadata;
    }
}