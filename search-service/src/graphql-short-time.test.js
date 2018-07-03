import { Kind } from "graphql";
import GraphQLShortTime from "./graphql-short-time";

describe("parseValue", () => {
  it("should parse a valid string value", () => {
    const result = GraphQLShortTime.parseValue("23:59");
    expect(result).toEqual("23:59");
  });

  it("should fail to parse an invalid string value", () => {
    expect(() => GraphQLShortTime.parseValue("24:59")).toThrow();
  });

  it("should fail to parse a bool value", () => {
    expect(() => GraphQLShortTime.parseValue(true)).toThrow();
  });

  it("should fail to parse a null value", () => {
    expect(() => GraphQLShortTime.parseValue(null)).toThrow();
  });
});

describe("parseLiteral", () => {
  it("should parse a valid string literal", () => {
    const result = GraphQLShortTime.parseLiteral({
      value: "23:59",
      kind: Kind.STRING
    });
    expect(result).toEqual("23:59");
  });

  it("should fail to parse an invalid string literal", () => {
    expect(() =>
      GraphQLShortTime.parseLiteral({ value: "24:59", kind: Kind.STRING })
    ).toThrow();
  });

  it("should fail to parse an int literal", () => {
    expect(() =>
      GraphQLShortTime.parseLiteral({ value: 39, kind: Kind.INT })
    ).toThrow();
  });
});

describe("serialize", () => {
  it("should serialize a string", () => {
    const result = GraphQLShortTime.serialize("23:59");
    expect(result).toEqual("23:59");
  });

  it("should not serialize a number", () => {
    expect(() => GraphQLShortTime.serialize(23)).toThrow();
  });
});
