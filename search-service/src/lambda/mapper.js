import mappr from "mappr";
import _ from "lodash";

const mapLocation = mappr(
  {
    location: mappr({
      north: "queryStringParameters.north",
      south: "queryStringParameters.south",
      east: "queryStringParameters.east",
      west: "queryStringParameters.west"
    })
  },
  result => ({
    location: _.isEmpty(result.location) ? undefined : result.location
  })
);

export const mapEventFullSearchEvent = mappr.compose(
  {
    term: "queryStringParameters.term",
    skip: "queryStringParameters.skip",
    take: "queryStringParameters.take",
    dateFrom: "queryStringParameters.dateFrom",
    dateTo: "queryStringParameters.dateTo",
    timeFrom: "queryStringParameters.timeFrom",
    timeTo: "queryStringParameters.timeTo",
    area: "queryStringParameters.area",
    medium: "queryStringParameters.medium",
    style: "queryStringParameters.style",
    audience: "queryStringParameters.audience",
    cost: "queryStringParameters.cost",
    booking: "queryStringParameters.booking",
    venueId: "queryStringParameters.venueId",
    talentId: "queryStringParameters.talentId"
  },
  mapLocation
);

export function mapIndexDocumentEvent(event) {
  return JSON.parse(event.body);
}

export function mapResponse(response, event) {
  return {
    body: JSON.stringify(response),
    headers: {
      "Cache-Control": event.admin ? "no-cache" : "public, max-age=1800"
    }
  };
}
