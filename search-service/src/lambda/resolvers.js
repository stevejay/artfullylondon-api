import { GraphQLError } from "graphql/error";
import * as entityType from "../types/entity-type";
import * as searcher from "../searcher";

export default {
  Autocomplete: {
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
  Query: {
    async autocompleteSearch(obj, params) {
      return await searcher.autocompleteSearch(params);
    },
    async basicSearch(obj, params) {
      return await searcher.basicSearch(params);
    }
  }
};
