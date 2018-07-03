import { Kind, GraphQLScalarType } from "graphql";

function validateShortTime(value) {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

export default new GraphQLScalarType({
  name: "ShortTime",
  serialize(value) {
    if (typeof value === "string" || value instanceof String) {
      return value;
    }
    throw new TypeError(
      `ShortTime cannot be serialized from a non string ${JSON.stringify(
        value
      )}`
    );
  },
  parseValue(value) {
    if (!(typeof value === "string" || value instanceof String)) {
      throw new TypeError(
        `ShortTime cannot represent non string type ${JSON.stringify(value)}`
      );
    }
    if (validateShortTime(value)) {
      return value;
    }
    throw new TypeError(
      `ShortTime cannot represent an invalid time-string ${value}.`
    );
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `ShortTime cannot represent non string type ${ast.value}`
      );
    }
    if (validateShortTime(ast.value)) {
      return ast.value;
    }
    throw new TypeError(
      `ShortTime cannot represent an invalid time-string ${ast.value}.`
    );
  }
});
