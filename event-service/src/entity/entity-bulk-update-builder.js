"use strict";

const BulkUpdateBuilder = require("es-bulk-update-builder");
const globalConstants = require("../constants");

class EntityBulkUpdateBuilder {
  constructor() {
    this.builder = new BulkUpdateBuilder();
  }

  addFullSearchUpdate(document, indexName) {
    // Event full search does not use external versioning.

    const version =
      document.entityType === globalConstants.ENTITY_TYPE_EVENT
        ? null
        : document.version;

    this.builder.index(document, indexName, "doc", document.id, version);
    return this;
  }

  addAutocompleteSearchUpdate(document, indexName) {
    if (document.status === globalConstants.STATUS_TYPE_ACTIVE) {
      this.builder.index(
        document,
        indexName,
        "doc",
        document.id,
        document.version
      );
    } else {
      this.builder.delete(indexName, "doc", document.id, document.version);
    }

    return this;
  }

  build() {
    return this.builder.build();
  }
}

module.exports = exports = EntityBulkUpdateBuilder;
