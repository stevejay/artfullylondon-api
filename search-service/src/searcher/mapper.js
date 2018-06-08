import _ from "lodash";
import fp from "lodash/fp";
import mappr from "mappr";
import looseInterleave from "loose-interleave";
import * as entityType from "../entity-type";
import * as searchPresetType from "../search-preset-type";

export function mapAutocompleteSearchParams(params) {
  return {
    ...params,
    singleEntitySearch: params.entityType !== entityType.ALL
  };
}

export function mapAutocompleteSearchResult(result) {
  return {
    items: _
      .unionBy(
        result.suggest.autocomplete[0].options,
        result.suggest.fuzzyAutocomplete[0].options,
        "_source.id"
      )
      .map(option => ({ ...option._source, name: option.text }))
  };
}

export function mapBasicSearchResults(results, take) {
  const mapped = results.responses.map(response => ({
    items: response.hits.hits.map(hit => hit._source),
    total: response.hits.total
  }));

  const hasSingleEntityType = mapped.length === 1;

  const items = hasSingleEntityType
    ? mapped[0].items
    : _.take(
        looseInterleave.apply(null, mapped.map(element => element.items)),
        take
      );

  const total = hasSingleEntityType ? mapped[0].total : items.length;
  return { items, total };
}

export function mapEventAdvancedSearchResults(result) {
  return {
    items: result.hits.hits.map(hit => hit._source),
    total: result.hits.total
  };
}

export function mapPresetSearchResults(results, presetName) {
  switch (presetName) {
    case searchPresetType.ENTITY_COUNTS:
      return {
        items: _
          .zip(
            [
              entityType.EVENT,
              entityType.EVENT_SERIES,
              entityType.TALENT,
              entityType.VENUE
            ],
            results.responses
          )
          .map(element => ({
            entityType: element[0],
            count: element[1].hits.total
          }))
      };
    default:
      return { items: results.hits.hits.map(hit => hit._source) };
  }
}

export const mapEventSearchParams = mappr.compose(
  fp.pick([
    "term",
    "dateFrom",
    "dateTo",
    "timeFrom",
    "timeTo",
    "area",
    "location",
    "audience",
    "venueId",
    "talentId",
    "skip",
    "take"
  ]),
  { costType: "cost", bookingType: "booking" },
  mappr({ artsType: mapMediumToCategoryForEventSearch }),
  mappr({ tags: mapTagsForEventSearch })
);

function mapTagsForEventSearch(src) {
  if (!src.medium || src.medium.startsWith(":")) {
    return undefined;
  }

  if (!src.style) {
    return [src.medium];
  }

  const styleId = src.style.slice(5); // removes initial 'style' text
  return [src.medium + styleId];
}

function mapMediumToCategoryForEventSearch(src) {
  if (!src.medium || !src.medium.startsWith(":")) {
    return undefined;
  }

  switch (src.medium) {
    case ":all-visual":
      return "Visual";
    case ":all-performing":
      return "Performing";
    case ":all-creative-writing":
      return "CreativeWriting";
    default:
      throw new Error(`Unknown medium ${src.medium}`);
  }
}
