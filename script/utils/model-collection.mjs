/**
 * Minimal ModelCollection for your pseudodocuments.
 * No subtypes, no documentConfig, no TYPES.
 */
export default class ModelCollection extends foundry.utils.Collection {

	/**
	 * @param {string} documentName
	 * @param {Document} parent
	 * @param {object} sourceData
	 */
	constructor(documentName, parent, sourceData) {
		super();

		Object.defineProperties(this, {
			documentName: { value: documentName, writable: false },
			parent: { value: parent, writable: false },
			_source: { value: sourceData ?? {}, writable: false },
			documentClass: { value: null, writable: true } // set later by field
		});
	}

	/* -------------------------------------------------- */
	/*  Properties                                        */
	/* -------------------------------------------------- */

	get contents() {
		return Array.from(this.values());
	}

	get sourceContents() {
		return this._source;
	}

	/* -------------------------------------------------- */
	/*  Initialization                                    */
	/* -------------------------------------------------- */

	initialize(model, options = {}) {
		this._initialized = false;

		for (const data of Object.values(this._source)) {
		this.#initializeDocument(data, options);
		}

		this._initialized = true;
	}

	#initializeDocument(data, options) {
		const id = data._id ?? (data._id = foundry.utils.randomID());

		let doc = this.get(id);
		if (doc) {
		doc._initialize?.(options);
		return doc;
		}

		const Cls = this.documentClass;
		doc = new Cls(data, { parent: this.parent });
		super.set(id, doc);

		return doc;
	}

	/* -------------------------------------------------- */
	/*  CRUD operations                                   */
	/* -------------------------------------------------- */

	add(doc) {
		this._source[doc.id] = doc._source;
		return super.set(doc.id, doc);
	}

	delete(id) {
		delete this._source[id];
		return super.delete(id);
	}

	set(id, doc) {
		this._source[id] = doc._source;
		return super.set(id, doc);
	}

	/* -------------------------------------------------- */

	toObject() {
		return this.contents.map(d => d.toObject?.(true) ?? d._source);
	}
}
