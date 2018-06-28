import BulkUpdateBuilder from "./bulk-update-builder";
import * as statusType from "../types/status-type";
import * as entityType from "../types/entity-type";

describe("addFullSearchUpdate", () => {
  it("should add a full search update", () => {
    const document = {
      entityType: entityType.TALENT,
      id: "talent/some-id",
      version: 4
    };

    const subject = new BulkUpdateBuilder();

    subject.addFullSearchUpdate(document, "some-index");

    const result = subject.build();

    expect(result).toEqual([
      {
        index: {
          _index: "some-index",
          _type: "doc",
          _id: "talent/some-id",
          _version: 4,
          _version_type: "external_gte"
        }
      },
      document
    ]);
  });

  it("should add a full search update for an event", () => {
    const document = {
      entityType: entityType.EVENT,
      id: "event/some-id",
      version: 4
    };

    const subject = new BulkUpdateBuilder();

    subject.addFullSearchUpdate(document, "some-index");

    const result = subject.build();

    expect(result).toEqual([
      {
        index: {
          _index: "some-index",
          _type: "doc",
          _id: "event/some-id",
          _version: 4,
          _version_type: "external_gte"
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
      status: statusType.ACTIVE,
      entityType: entityType.TALENT,
      id: "talent/some-id",
      version: 4
    };

    const subject = new BulkUpdateBuilder();

    subject.addAutocompleteSearchUpdate(document, "some-auto-index");

    const result = subject.build();

    expect(result).toEqual([
      {
        index: {
          _index: "some-auto-index",
          _type: "doc",
          _id: "talent/some-id",
          _version: 4,
          _version_type: "external_gte"
        }
      },
      document
    ]);
  });

  it("should add a delete autocomplete search update for a deleted entity", () => {
    const document = {
      nameSuggest: [],
      status: "Deleted",
      entityType: entityType.TALENT,
      id: "talent/some-id",
      version: 4
    };

    const subject = new BulkUpdateBuilder();

    subject.addAutocompleteSearchUpdate(document, "some-auto-index");

    const result = subject.build();

    expect(result).toEqual([
      {
        delete: {
          _index: "some-auto-index",
          _type: "doc",
          _id: "talent/some-id"
        }
      }
    ]);
  });
});
