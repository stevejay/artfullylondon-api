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

  type TagSet {
    medium: [Tag!]
    style: [Tag!]
    geo: [Tag!]
    audience: [Tag!]
  }

  type Query {
    tags: TagSet!
  }

  input CreateTagInput {
    tag: CreateTagInputTag!
  }

  input CreateTagInputTag {
    tagType: TagTypeEnum!
    label: String!
  }

  type CreateTagOutput {
    tag: Tag
  }

  input DeleteTagInput {
    tag: DeleteTagInputTag!
  }

  input DeleteTagInputTag {
    id: ID!
  }

  type DeleteTagOutput {
    ok: Boolean
  }

  type Mutation {
    createTag(input: CreateTagInput!): CreateTagOutput
    deleteTag(input: DeleteTagInput!): DeleteTagOutput
  }
`;
