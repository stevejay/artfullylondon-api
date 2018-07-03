import deepFreeze from "deep-freeze";
import * as validator from "./validator";
import * as entityType from "../types/entity-type";

describe("validateIndexDocumentRequest", () => {
  describe("valid requests", () => {
    test.each([
      [
        {
          entityType: entityType.TALENT,
          entity: {
            id: "talent/talent1",
            entityType: entityType.TALENT,
            version: 1
          }
        }
      ]
    ])("%o should validate", arg => {
      expect(() =>
        validator.validateIndexDocumentRequest(deepFreeze(arg))
      ).not.toThrow();
    });
  });

  describe("invalid requests", () => {
    test.each([
      [
        {
          entityType: "not-a-type",
          entity: {
            id: "talent/talent1",
            entityType: entityType.TALENT,
            version: 2
          }
        }
      ]
    ])("%o should fail to validate", arg => {
      expect(() =>
        validator.validateIndexDocumentRequest(deepFreeze(arg))
      ).toThrow();
    });
  });
});
