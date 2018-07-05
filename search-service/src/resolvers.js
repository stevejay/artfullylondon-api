import { GraphQLError } from "graphql/error";
import { RegexType } from "@okgrow/graphql-scalars";
import addDays from "date-fns/addDays";
import * as entityType from "./types/entity-type";
import * as areaType from "./types/area-type";
import * as searcher from "./searcher";
import * as timeUtils from "./time-utils";

const IsoShortDate = new RegexType(
  "IsoShortDate",
  /^[12]\d\d\d-[01]\d-[0123]\d$/
);
const ShortTime = new RegexType(
  "ShortTime",
  /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
);

export default {
  IsoShortDate,
  ShortTime,
  AutocompleteNode: {
    __resolveType(obj) {
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
      return await searcher.basicSearch(params);
    },
    async eventAdvancedSearch(obj, params) {
      return await searcher.eventAdvancedSearch(params);
    },
    async entityCount() {
      return await searcher.entityCountSearch();
    },
    async sitemapEvent() {
      return await searcher.sitemapEventSearch();
    },
    async featuredEvents(obj, params) {
      const now = timeUtils.getUtcNow();
      const presetParams = {
        ...params,
        area: areaType.CENTRAL,
        dateFrom: timeUtils.formatAsIsoShortDateString(now),
        dateTo: timeUtils.formatAsIsoShortDateString(addDays(now, 14))
      };
      return await searcher.eventAdvancedSearch(presetParams);
    },
    async venueRelatedEvents(obj, params) {
      const now = timeUtils.getUtcNow();
      const presetParams = {
        ...params,
        dateFrom: timeUtils.formatAsIsoShortDateString(now),
        dateTo: timeUtils.formatAsIsoShortDateString(addDays(now, 366))
      };
      return await searcher.eventAdvancedSearch(presetParams);
    },
    async talentRelatedEvents(obj, params) {
      const now = timeUtils.getUtcNow();
      const presetParams = {
        ...params,
        dateFrom: timeUtils.formatAsIsoShortDateString(now),
        dateTo: timeUtils.formatAsIsoShortDateString(addDays(now, 366))
      };
      return await searcher.eventAdvancedSearch(presetParams);
    },
    async eventSeriesRelatedEvents(obj, params) {
      const now = timeUtils.getUtcNow();
      const presetParams = {
        ...params,
        dateFrom: timeUtils.formatAsIsoShortDateString(now),
        dateTo: timeUtils.formatAsIsoShortDateString(addDays(now, 366))
      };
      return await searcher.eventAdvancedSearch(presetParams);
    }
  }
};
