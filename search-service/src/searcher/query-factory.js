import * as searchIndexType from "./search-index-type";
import * as entityType from "../entity-type";
import * as searchTemplateType from "./search-template-type";

export function createEntityCountsSearches() {
  const searches = [];

  [
    searchIndexType.EVENT,
    searchIndexType.EVENT_SERIES,
    searchIndexType.TALENT,
    searchIndexType.VENUE
  ].forEach(index => {
    searches.push({ index, type: "doc" });
    searches.push({ query: { match_all: {} }, from: 0, size: 0 });
  });

  return searches;
}

export function createBasicSearchTemplateSearches(params) {
  const data = getBasicSearchDataForEntityType(params.entityType);
  const searches = [];

  data.forEach(datum => {
    searches.push({ index: datum.index, type: "doc" });
    searches.push({ id: datum.name, params });
  });

  return searches;
}

function getBasicSearchDataForEntityType(type) {
  switch (type) {
    case entityType.TALENT:
      return [
        { index: searchIndexType.TALENT, name: searchTemplateType.TALENT }
      ];
    case entityType.VENUE:
      return [{ index: searchIndexType.VENUE, name: searchTemplateType.VENUE }];
    case entityType.EVENT:
      return [{ index: searchIndexType.EVENT, name: searchTemplateType.EVENT }];
    case entityType.EVENT_SERIES:
      return [
        {
          index: searchIndexType.EVENT_SERIES,
          name: searchTemplateType.EVENT_SERIES
        }
      ];
    case entityType.ALL:
      return [
        { index: searchIndexType.TALENT, name: searchTemplateType.TALENT },
        { index: searchIndexType.VENUE, name: searchTemplateType.VENUE },
        {
          index: searchIndexType.EVENT_SERIES,
          name: searchTemplateType.EVENT_SERIES
        },
        { index: searchIndexType.EVENT, name: searchTemplateType.EVENT }
      ];
    default:
      throw new Error(`entity type value out of range: ${type}`);
  }
}
