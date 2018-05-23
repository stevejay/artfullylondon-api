"use strict";

const EntityBulkUpdateBuilder = require("./entity-bulk-update-builder");

describe("entity-bulk-update-builder", () => {
  describe("addFullSearchUpdate", () => {
    it("should add a full search update", () => {
      const document = {
        entityType: "talent",
        id: "some-id",
        version: 4
      };

      const subject = new EntityBulkUpdateBuilder();

      subject.addFullSearchUpdate(document, "some-index");

      const result = subject.build();

      expect(result).toEqual([
        {
          index: {
            _index: "some-index",
            _type: "doc",
            _id: "some-id",
            _version: 4,
            _version_type: "external"
          }
        },
        document
      ]);
    });

    it("should add a full search update for an event", () => {
      const document = {
        entityType: "event",
        id: "some-id",
        version: 4
      };

      const subject = new EntityBulkUpdateBuilder();

      subject.addFullSearchUpdate(document, "some-index");

      const result = subject.build();

      expect(result).toEqual([
        {
          index: {
            _index: "some-index",
            _type: "doc",
            _id: "some-id"
          }
        },
        document
      ]);
    });
  });

  describe("addAutocompleteSearchUpdate", () => {
    it("should add an index autocomplete search update for an active entity", () => {
      const document = {
        nameSuggest: [],
        status: "Active",
        entityType: "talent",
        id: "some-id",
        version: 4
      };

      const subject = new EntityBulkUpdateBuilder();

      subject.addAutocompleteSearchUpdate(document, "some-auto-index");

      const result = subject.build();

      expect(result).toEqual([
        {
          index: {
            _index: "some-auto-index",
            _type: "doc",
            _id: "some-id",
            _version: 4,
            _version_type: "external"
          }
        },
        document
      ]);
    });

    it("should add a delete autocomplete search update for a deleted entity", () => {
      const document = {
        nameSuggest: [],
        status: "Deleted",
        entityType: "talent",
        id: "some-id",
        version: 4
      };

      const subject = new EntityBulkUpdateBuilder();

      subject.addAutocompleteSearchUpdate(document, "some-auto-index");

      const result = subject.build();

      expect(result).toEqual([
        {
          delete: {
            _index: "some-auto-index",
            _type: "doc",
            _id: "some-id",
            _version: 4,
            _version_type: "external"
          }
        }
      ]);
    });
  });
});
