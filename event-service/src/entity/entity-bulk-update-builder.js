"use strict";

const BulkUpdateBuilder = require("es-bulk-update-builder");
const globalConstants = require("../constants");

class EntityBulkUpdateBuilder {
  constructor() {
    this.builder = new BulkUpdateBuilder();
  }

  addFullSearchUpdate(document, indexName) {
    this.builder.index(
      document,
      indexName,
      "doc",
      document.id,
      document.version,
      "external_gte"
    );
    return this;
  }

  addAutocompleteSearchUpdate(document, indexName) {
    if (document.status === globalConstants.STATUS_TYPE_ACTIVE) {
      this.builder.index(
        document,
        indexName,
        "doc",
        document.id,
        document.version,
        "external_gte"
      );
    } else {
      this.builder.delete(indexName, "doc", document.id);
    }

    return this;
  }

  build() {
    return this.builder.build();
  }
}

module.exports = exports = EntityBulkUpdateBuilder;
