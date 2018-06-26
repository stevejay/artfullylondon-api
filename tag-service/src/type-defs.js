import { gql } from "apollo-server-lambda";

export default gql`
  enum TagTypeEnum {
    medium
    style
    geo
    audience
  }

  type Tag {
    tagType: TagTypeEnum!
    id: ID!
    label: String!
  }

  type Query {
    tags(tagType: TagTypeEnum): [Tag]
  }
`;
