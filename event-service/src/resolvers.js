import { RegularExpression } from "@okgrow/graphql-scalars";
import * as talentService from "./talent-service";
import * as venueService from "./venue-service";
import * as eventSeriesService from "./event-series-service";
import * as eventService from "./event-service";
import * as searchIndexService from "./search-index-service";
import * as validator from "./validator";

const IsoShortDate = new RegularExpression(
  "IsoShortDate",
  /^[12]\d\d\d-[01]\d-[0123]\d$/
);

const ShortTime = new RegularExpression(
  "ShortTime",
  /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
);

export default {
  IsoShortDate,
  ShortTime,
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
    async createTalent(__, params, context) {
      validator.validateUserForMutation(context);
      const talent = await talentService.createOrUpdate(params.input);
      return { talent };
    },
    async updateTalent(__, params, context) {
      validator.validateUserForMutation(context);
      const talent = await talentService.createOrUpdate(params.input);
      return { talent };
    },
    async createVenue(__, params, context) {
      validator.validateUserForMutation(context);
      const venue = await venueService.createOrUpdate(params.input);
      return { venue };
    },
    async updateVenue(__, params, context) {
      validator.validateUserForMutation(context);
      const venue = await venueService.createOrUpdate(params.input);
      return { venue };
    },
    async createEventSeries(__, params, context) {
      validator.validateUserForMutation(context);
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { eventSeries };
    },
    async updateEventSeries(__, params, context) {
      validator.validateUserForMutation(context);
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { eventSeries };
    },
    async createEvent(__, params, context) {
      validator.validateUserForMutation(context);
      const event = await eventService.createOrUpdate(params.input);
      return { event };
    },
    async updateEvent(__, params, context) {
      validator.validateUserForMutation(context);
      const event = await eventService.createOrUpdate(params.input);
      return { event };
    },
    async refreshSearchIndex(__, params, context) {
      validator.validateUserForMutation(context);
      await searchIndexService.refreshSearchIndex(params.input);
      return { ok: true };
    }
  }
};
