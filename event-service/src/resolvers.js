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
      return await talentService.get(params);
    },
    async talentForEdit(__, params) {
      return await talentService.getForEdit(params);
    },
    async venue(__, params) {
      return await venueService.get(params);
    },
    async venueForEdit(__, params) {
      return await venueService.getForEdit(params);
    },
    async eventSeries(__, params) {
      return await eventSeriesService.get(params);
    },
    async eventSeriesForEdit(__, params) {
      return await eventSeriesService.getForEdit(params);
    },
    async event(__, params) {
      return await eventService.get(params);
    },
    async eventForEdit(__, params) {
      return await eventService.getForEdit(params);
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
