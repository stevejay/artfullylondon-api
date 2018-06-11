import mappr from "mappr";
import _ from "lodash";

export const mapRouteType = mappr({
  isPublic: event => event.resource.startsWith("/public/")
});

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

export const mapAutocompleteSearchEvent = mappr({
  term: "queryStringParameters.term",
  entityType: "queryStringParameters.entityType"
});

export const mapBasicSearchEvent = mappr.compose(
  {
    term: "queryStringParameters.term",
    entityType: "queryStringParameters.entityType",
    skip: "queryStringParameters.skip",
    take: "queryStringParameters.take"
  },
  mapLocation,
  mapRouteType
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

export const mapPresetSearchEvent = mappr({
  name: "pathParameters.name",
  id: "queryStringParameters.id"
});

export function mapIndexDocumentEvent(event) {
  return JSON.parse(event.body);
}

export function mapResponse(response, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(response)
  };
}
