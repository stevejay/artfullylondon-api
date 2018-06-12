import ESBulkUpdateBuilder from "es-bulk-update-builder";
import * as statusType from "../types/status-type";

export default class BulkUpdateBuilder {
  constructor() {
    this._builder = new ESBulkUpdateBuilder();
  }
  addFullSearchUpdate(document, indexName) {
    this._builder.index(
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
    const autocompleteId = `${document.entityType}_${document.id}`;

    if (document.status === statusType.ACTIVE) {
      this._builder.index(
        document,
        indexName,
        "doc",
        autocompleteId,
        document.version,
        "external_gte"
      );
    } else {
      this._builder.delete(indexName, "doc", autocompleteId);
    }

    return this;
  }
  build() {
    return this._builder.build();
  }
}
