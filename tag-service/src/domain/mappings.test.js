"use strict";

const mappings = require("./mappings");

describe("mappings", () => {
  it("should map a request to a db tag", () => {
    const request = {
      type: "geo",
      label: "usa"
    };

    const result = mappings.mapRequestToDbTag("geo/usa", request);

    expect(result).toEqual({
      id: "geo/usa",
      tagType: "geo",
      label: "usa"
    });
  });

  it("should map a db tag to a response", () => {
    const dbTag = {
      id: "geo/usa",
      tagType: "geo",
      label: "usa"
    };

    const result = mappings.mapDbTagToResponse(dbTag);

    expect(result).toEqual({
      id: "geo/usa",
      label: "usa"
    });
  });
});
