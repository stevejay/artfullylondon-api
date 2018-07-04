// import { GraphQLError } from "graphql/error";
import { GraphQLDate } from "graphql-iso-date";
import GraphQLShortTime from "./graphql-short-time";
import * as talentService from "./talent-service";
import * as venueService from "./venue-service";
import * as eventSeriesService from "./event-series-service";
import * as eventService from "./event-service";

export default {
  IsoShortDate: GraphQLDate,
  ShortTime: GraphQLShortTime,
  Query: {
    async talent(__, params) {
      const talent = await talentService.get(params);
      return talent;
    },
    async venue(__, params) {
      const venue = await venueService.get(params);
      return venue;
    },
    async eventSeries(__, params) {
      const eventSeries = await eventSeriesService.get(params);
      return eventSeries;
    },
    async event(__, params) {
      const event = await eventService.get(params);
      return event;
    }
  },
  Mutation: {
    async createTalent(__, params) {
      const talent = await talentService.createOrUpdate(params.input);
      return { talent };
    },
    async updateTalent(__, params) {
      const talent = await talentService.createOrUpdate(params.input);
      return { talent };
    },
    async createVenue(__, params) {
      const venue = await venueService.createOrUpdate(params.input);
      return { venue };
    },
    async updateVenue(__, params) {
      const venue = await venueService.createOrUpdate(params.input);
      return { venue };
    },
    async createEventSeries(__, params) {
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { eventSeries };
    },
    async updateEventSeries(__, params) {
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { eventSeries };
    },
    async createEvent(__, params) {
      const event = await eventService.createOrUpdate(params.input);
      return { event };
    },
    async updateEvent(__, params) {
      const event = await eventService.createOrUpdate(params.input);
      return { event };
    }
  }
};
