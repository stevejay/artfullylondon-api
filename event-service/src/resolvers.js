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
    async talent(parent, params) {
      return { node: await talentService.get(params) };
    },
    async talentForEdit(parent, params) {
      return { node: await talentService.getForEdit(params) };
    },
    async venue(parent, params) {
      return { node: await venueService.get(params) };
    },
    async venueForEdit(parent, params) {
      return { node: await venueService.getForEdit(params) };
    },
    async eventSeries(parent, params) {
      return { node: await eventSeriesService.get(params) };
    },
    async eventSeriesForEdit(parent, params) {
      return { node: await eventSeriesService.getForEdit(params) };
    },
    async event(parent, params) {
      return { node: await eventService.get(params) };
    },
    async eventForEdit(parent, params) {
      return { node: await eventService.getForEdit(params) };
    }
  },
  Mutation: {
    async createTalent(parent, params, context) {
      validator.validateUserForMutation(context);
      const talent = await talentService.createOrUpdate(params.input);
      return { node: talent };
    },
    async updateTalent(parent, params, context) {
      validator.validateUserForMutation(context);
      const talent = await talentService.createOrUpdate(params.input);
      return { node: talent };
    },
    async createVenue(parent, params, context) {
      validator.validateUserForMutation(context);
      const venue = await venueService.createOrUpdate(params.input);
      return { node: venue };
    },
    async updateVenue(parent, params, context) {
      validator.validateUserForMutation(context);
      const venue = await venueService.createOrUpdate(params.input);
      return { node: venue };
    },
    async createEventSeries(parent, params, context) {
      validator.validateUserForMutation(context);
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { node: eventSeries };
    },
    async updateEventSeries(parent, params, context) {
      validator.validateUserForMutation(context);
      const eventSeries = await eventSeriesService.createOrUpdate(params.input);
      return { node: eventSeries };
    },
    async createEvent(parent, params, context) {
      validator.validateUserForMutation(context);
      const event = await eventService.createOrUpdate(params.input);
      return { node: event };
    },
    async updateEvent(parent, params, context) {
      validator.validateUserForMutation(context);
      const event = await eventService.createOrUpdate(params.input);
      return { node: event };
    },
    async refreshSearchIndex(parent, params, context) {
      validator.validateUserForMutation(context);
      await searchIndexService.refreshSearchIndex(params.input);
      return { ok: true };
    }
  }
};
