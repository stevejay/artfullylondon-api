"use strict";

import ESBulkUpdateBuilder from "es-bulk-update-builder";
import * as statusType from "../status-type";

export default class BulkUpdateBuilder {
  constructor() {
    this.builder = new ESBulkUpdateBuilder();
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
    if (document.status === statusType.ACTIVE) {
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
