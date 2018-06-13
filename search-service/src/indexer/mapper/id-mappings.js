import _ from "lodash";
import * as linkType from "../../types/link-type";

export function mapExternalEventId(event) {
  const homepage = _.find(event.links, link => link.type === linkType.HOMEPAGE);
  return homepage && homepage.url
    ? createExternalEventId(event.venue.id, homepage.url)
    : null;
}

const URL_PREFIX_REGEX = /^https?:\/\/[^/]+/i;

function createExternalEventId(venueId, eventUrl) {
  const normalisedEventUrl =
    eventUrl.replace(URL_PREFIX_REGEX, "").toLowerCase() || "/";
  return venueId + "|" + normalisedEventUrl;
}
