"use strict";

const addressNormaliser = require("./address-normaliser");

describe("venue address normaliser", () => {
  it("should normalise an address", () => {
    const address =
      "  23 The Gate  \r\n  \n Islington \n London\n\n\r\n\r\n   ";
    const result = addressNormaliser(address);
    expect(result).toEqual("23 The Gate\nIslington\nLondon");
  });
});
