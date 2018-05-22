'use strict';

const constants = require('../constants');

exports.mapAutocompleteSearchHandlerDataToRequest = function(event) {
  const result = {};
  const query = event.queryStringParameters || {};

  if (query.term) {
    result.term = query.term;
  }
  if (query.entityType) {
    result.entityType = query.entityType;
  }

  return result;
};

exports.mapBasicSearchHandlerDataToRequest = function(event) {
  const result = {};
  const query = event.queryStringParameters || {};

  result.term = query.term;
  result.entityType = query.entityType;
  result.skip = query.skip;
  result.take = query.take;
  result.location = _mapSearchQueryLocation(query);

  return result;
};

exports.mapEventFullSearchHandlerDataToRequest = function(event) {
  const result = {};
  const query = event.queryStringParameters || {};

  if (query.term) {
    result.term = query.term;
  }
  if (query.dateFrom) {
    result.dateFrom = query.dateFrom;
  }
  if (query.dateTo) {
    result.dateTo = query.dateTo;
  }
  if (query.timeFrom) {
    result.timeFrom = query.timeFrom;
  }
  if (query.timeTo) {
    result.timeTo = query.timeTo;
  }
  if (query.area) {
    result.area = query.area;
  }
  if (query.medium) {
    result.medium = query.medium;
  }
  if (query.style) {
    result.style = query.style;
  }
  if (query.audience) {
    result.audience = query.audience;
  }
  if (query.cost) {
    result.cost = query.cost;
  }
  if (query.booking) {
    result.booking = query.booking;
  }
  if (query.venueId) {
    result.venueId = query.venueId;
  }
  if (query.talentId) {
    result.talentId = query.talentId;
  }
  if (query.skip != null) {
    result.skip = query.skip;
  }
  if (query.take != null) {
    result.take = query.take;
  }

  const location = _mapSearchQueryLocation(query);
  if (location) {
    result.location = location;
  }

  return result;
};

exports.mapAutocompleteSearchResults = function(responses, indexNames) {
  return indexNames.map((indexName, i) => {
    const suggestResults = responses.responses[i].suggest;

    const autoResults = suggestResults.autocomplete.length
      ? suggestResults.autocomplete[0].options.map(_mapAutocompleteOption)
      : [];

    const fuzzyAutoResults = suggestResults.fuzzyAutocomplete.length
      ? suggestResults.fuzzyAutocomplete[0].options.map(_mapAutocompleteOption)
      : [];

    const results = exports.flattenSearchResults(autoResults, fuzzyAutoResults);

    return {
      entityType: _getEntityTypeFromIndexName(indexName),
      items: results,
    };
  });
};

exports.flattenSearchResults = function(/* ...sources */) {
  const result = [];
  const resultIdLookup = {};
  const sources = arguments;

  for (let i = 0; i < sources.length; ++i) {
    for (let j = 0; j < sources[i].length; ++j) {
      const source = sources[i][j];

      if (!resultIdLookup[source.id]) {
        result.push(source);
        resultIdLookup[source.id] = true;
      }
    }
  }

  return result;
};

exports.mapSearchResultHitsToItems = function(response) {
  const hits = response.hits;
  const items = hits.hits.map(hit => hit._source);
  return { total: hits.total, items };
};

exports.getTakeFromSearchResults = function(take, sources) {
  const result = [];
  let pushedCount = 0;

  for (let scanIndex = 0; scanIndex < take; ++scanIndex) {
    let loopPushedCount = 0;

    for (let sourcesIndex = 0; sourcesIndex < sources.length; ++sourcesIndex) {
      const source = sources[sourcesIndex];

      if (source.items.length > scanIndex) {
        const item = source.items[scanIndex];
        result.push(item);

        pushedCount += 1;
        loopPushedCount += 1;
      }

      if (pushedCount >= take) {
        break;
      }
    }

    if (pushedCount >= take || loopPushedCount === 0) {
      break;
    }
  }

  return result;
};

function _mapSearchQueryLocation(query) {
  if (
    query &&
    query.north != null &&
    query.south != null &&
    query.east != null &&
    query.west != null
  ) {
    return {
      north: query.north,
      south: query.south,
      east: query.east,
      west: query.west,
    };
  } else {
    return undefined;
  }
}

function _mapAutocompleteOption(option) {
  return Object.assign({}, option._source, { name: option.text });
}

function _getEntityTypeFromIndexName(indexName) {
  switch (indexName) {
    case constants.SEARCH_INDEX_TYPE_TALENT_AUTO:
      return constants.ENTITY_TYPE_TALENT;
    case constants.SEARCH_INDEX_TYPE_VENUE_AUTO:
      return constants.ENTITY_TYPE_VENUE;
    case constants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO:
      return constants.ENTITY_TYPE_EVENT;
    case constants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO:
      return constants.ENTITY_TYPE_EVENT_SERIES;
    default:
      throw new Error(`indexName value out of range: ${indexName}`);
  }
}
