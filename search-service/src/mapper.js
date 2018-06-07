import * as entityType from "./entity-type";
import * as searchIndexType from "./search-index-type";

export function mapAutocompleteSearchResults(responses, indexNames) {
  return indexNames.map((indexName, i) => {
    const suggestResults = responses.responses[i].suggest;

    const autoResults = suggestResults.autocomplete.length
      ? suggestResults.autocomplete[0].options.map(_mapAutocompleteOption)
      : [];

    const fuzzyAutoResults = suggestResults.fuzzyAutocomplete.length
      ? suggestResults.fuzzyAutocomplete[0].options.map(_mapAutocompleteOption)
      : [];

    const results = flattenSearchResults(autoResults, fuzzyAutoResults);

    return {
      entityType: _getEntityTypeFromIndexName(indexName),
      items: results
    };
  });
}

export function flattenSearchResults(/* ...sources */) {
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
}

export function mapSearchResultHitsToItems(response) {
  const hits = response.hits;
  const items = hits.hits.map(hit => hit._source);
  return { total: hits.total, items };
}

export function getTakeFromSearchResults(take, sources) {
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
}

function _mapAutocompleteOption(option) {
  return Object.assign({}, option._source, { name: option.text });
}

function _getEntityTypeFromIndexName(indexName) {
  switch (indexName) {
    case searchIndexType.TALENT_AUTO:
      return entityType.TALENT;
    case searchIndexType.VENUE_AUTO:
      return entityType.VENUE;
    case searchIndexType.COMBINED_EVENT_AUTO:
      return entityType.EVENT;
    case searchIndexType.EVENT_SERIES_AUTO:
      return entityType.EVENT_SERIES;
    default:
      throw new Error(`indexName value out of range: ${indexName}`);
  }
}
