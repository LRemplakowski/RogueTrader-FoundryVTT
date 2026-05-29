import PseudoDocument from "../pseudo-document.mjs";

const { DocumentTypeField } = foundry.data.fields;

export default class BaseModifier extends PseudoDocument {
    static get metadata() {
        const metadata = super.metadata;
        metadata.documentName = "baseModifier";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.type = new DocumentTypeField(this);
        return schema;
    }
}