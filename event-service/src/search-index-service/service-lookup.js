import * as entityType from "../types/entity-type";
import * as venueService from "../venue-service";
import * as talentService from "../talent-service";
import * as eventService from "../event-service";
import * as eventSeriesService from "../event-series-service";

export function getEntityServiceForType(type) {
  switch (type) {
    case entityType.EVENT:
      return eventService;
    case entityType.EVENT_SERIES:
      return eventSeriesService;
    case entityType.TALENT:
      return talentService;
    case entityType.VENUE:
      return venueService;
    default:
      throw new Error(`Unsupported entity type ${type}`);
  }
}
