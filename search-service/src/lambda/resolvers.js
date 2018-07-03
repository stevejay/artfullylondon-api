import { GraphQLError } from "graphql/error";
import * as entityType from "../types/entity-type";
import * as searcher from "../searcher";

export default {
  AutocompleteNode: {
    __resolveType(obj /*, context, info*/) {
      switch (obj.entityType) {
        case entityType.EVENT:
          return "AutocompleteEvent";
        case entityType.EVENT_SERIES:
          return "AutocompleteEventSeries";
        case entityType.TALENT:
          return "AutocompleteTalent";
        case entityType.VENUE:
          return "AutocompleteVenue";
        default:
          throw new GraphQLError(`Unknown entity type: ${obj.entityType}`);
      }
    }
  },
  SearchNode: {
    __resolveType(obj) {
      switch (obj.entityType) {
        case entityType.EVENT:
          return "Event";
        case entityType.EVENT_SERIES:
          return "EventSeries";
        case entityType.TALENT:
          return "Talent";
        case entityType.VENUE:
          return "Venue";
        default:
          throw new GraphQLError(`Unknown entity type: ${obj.entityType}`);
      }
    }
  },
  Query: {
    async autocompleteSearch(obj, params) {
      return await searcher.autocompleteSearch(params);
    },
    async basicSearch(obj, params) {
      const searchResults = await searcher.basicSearch(params); // eslint-disable-line
      console.log("RESPONSE", JSON.stringify(searchResults)); // eslint-disable-line
      return searchResults;

      // return {
      //   edges: [],
      //   pageInfo: {
      //     hasNextPage: false
      //   }
      // };

      // return {
      //   edges: [{
      //     node: SearchNode!
      //     cursor: String!
      //   }],
      //   pageInfo: {
      //     hasNextPage: Boolean!
      //   }
      // }

      // edges: [SearchEdge!]!
      // pageInfo: PageInfo!
    }
  }
};
