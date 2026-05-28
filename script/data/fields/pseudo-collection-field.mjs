import { ModelCollection } from "../../utils/_module.mjs";

/**
 * A field that represents a collection of pseudodocuments.
 * Works with your simplified ModelCollection and pseudodocument classes.
 */
export default class PseudoCollectionField extends foundry.data.fields.ObjectField {

  /**
   * @param {typeof PseudoDocument} modelClass  The pseudodocument class.
   * @param {object} [options]
   */
  constructor(modelClass, options = {}) {
    super(options);

    if (typeof modelClass !== "function") {
      throw new Error("PseudoCollectionField requires a pseudodocument class.");
    }

    // Store the pseudodocument class on the instance
    Object.defineProperty(this, "documentClass", {
      value: modelClass,
      writable: false
    });
  }

  /** @inheritdoc */
  static hierarchical = true;

  /**
   * The collection implementation to use.
   */
  static get implementation() {
    return ModelCollection;
  }

  /**
   * Initialize the collection.
   * Called by Foundry when constructing the DataModel.
   */
  initialize(value, model, options = {}) {
    const name = this.documentClass.metadata.documentName;

    // Retrieve the collection created by your mixin
    const collection = model.parent.pseudoCollections[name];

    // Tell the collection which pseudodocument class to instantiate
    collection.documentClass = this.documentClass;

    // Initialize the collection with the parent DataModel
    collection.initialize(model, options);

    return collection;
  }

  /**
   * Handle updates to nested data.
   * This is the minimal version needed for your system.
   */
  _updateCommit(source, key, value, diff, options) {
    let src = source[key];

    // Handle null/undefined transitions
    if (!src || !value) {
      source[key] = value;
      return;
    }

    // Apply diff to source while preserving object references
    for (let [id, d] of Object.entries(diff)) {
      if (foundry.utils.isDeletionKey(id)) {
        if (id.startsWith("-")) {
          delete source[key][id.slice(2)];
          continue;
        }
        id = id.slice(2);
      } else if (d instanceof foundry.data.operators.ForcedDeletion) {
        delete source[key][id];
        continue;
      }

      const prior = src[id];
      if (prior) {
        this.element._updateCommit(src, id, value[id], d, options);
        src[id] = prior;
      } else {
        src[id] = d;
      }
    }
  }
}
