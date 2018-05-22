"use strict";

const constants = require("../constants");
const tag = require("./tag");
const time = require("./time");

exports.buildEntityCountsSearchPreset = function(msearchBuilder) {
  _buildEntityCountsSearch(
    msearchBuilder,
    constants.SEARCH_INDEX_TYPE_EVENT_FULL
  );

  _buildEntityCountsSearch(
    msearchBuilder,
    constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL
  );

  _buildEntityCountsSearch(
    msearchBuilder,
    constants.SEARCH_INDEX_TYPE_TALENT_FULL
  );

  _buildEntityCountsSearch(
    msearchBuilder,
    constants.SEARCH_INDEX_TYPE_VENUE_FULL
  );
};

function _buildEntityCountsSearch(msearchBuilder, index) {
  msearchBuilder.createSearch({ index, type: "doc" }).setSearchTake(0);
}

exports.buildByExternalEventIdPreset = function(
  msearchBuilder,
  externalEventIds
) {
  let searchSourceFields = ["externalEventId", "id"];

  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_EVENT_FULL,
      type: "doc"
    })
    .setSearchTake(1000)
    .setSearchSource(searchSourceFields);

  const boolQuery = search.createQuery().createBoolQuery();

  const ids = externalEventIds.split(",");
  boolQuery.addFilter().setTerms({ externalEventId: ids });
};

exports.buildFeaturedEventsSearchPreset = function(msearchBuilder) {
  const now = time.getLondonNow();

  const request = {
    skip: 0,
    take: 24,
    area: "Central",
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(14, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return exports.buildPublicEventSearch(msearchBuilder, request);
};

exports.buildTalentRelatedEventsSearchPreset = function(
  msearchBuilder,
  talentId
) {
  const now = time.getLondonNow();

  const request = {
    skip: 0,
    take: 300,
    talentId: talentId,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return exports.buildPublicEventSearch(msearchBuilder, request);
};

exports.buildVenueRelatedEventsSearchPreset = function(
  msearchBuilder,
  venueId
) {
  const now = time.getLondonNow();

  const request = {
    skip: 0,
    take: 300,
    venueId: venueId,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return exports.buildPublicEventSearch(msearchBuilder, request);
};

exports.buildEventSeriesRelatedEventsSearchPreset = function(
  msearchBuilder,
  eventSeriesId
) {
  const now = time.getLondonNow();

  const request = {
    skip: 0,
    take: 300,
    eventSeriesId: eventSeriesId,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return exports.buildPublicEventSearch(msearchBuilder, request);
};

exports.createPublicEventSearchParamsFromRequest = function(request) {
  const searchParams = {};

  if (request.term) {
    searchParams.term = request.term;
  }

  if (request.dateFrom) {
    searchParams.dateFrom = request.dateFrom;
  }

  if (request.dateTo) {
    searchParams.dateTo = request.dateTo;
  }

  if (request.timeFrom) {
    searchParams.timeFrom = request.timeFrom;
  }

  if (request.timeTo) {
    searchParams.timeTo = request.timeTo;
  }

  if (request.area) {
    searchParams.area = request.area;
  }

  if (request.location) {
    searchParams.location = request.location;
  }

  const hasMedium = !!request.medium;
  const hasTagForMedium = hasMedium && request.medium.indexOf(":") !== 0;

  if (hasMedium && !hasTagForMedium) {
    switch (request.medium) {
      case ":all-visual":
        searchParams.artsType = "Visual";
        break;
      case ":all-performing":
        searchParams.artsType = "Performing";
        break;
      case ":all-creative-writing":
        searchParams.artsType = "CreativeWriting";
        break;
    }
  }

  if (hasMedium && hasTagForMedium) {
    if (request.style) {
      searchParams.tags = [
        tag.createTagIdForMediumWithStyleTag(request.medium, request.style)
      ];
    } else {
      searchParams.tags = [request.medium];
    }
  }

  if (request.audience) {
    searchParams.audience = request.audience;
  }

  if (request.cost) {
    searchParams.costType = request.cost;
  }

  if (request.booking) {
    searchParams.bookingType = request.booking;
  }

  if (request.venueId) {
    searchParams.venueId = request.venueId;
  }

  if (request.talentId) {
    searchParams.talentId = request.talentId;
  }

  if (request.skip != null) {
    searchParams.skip = request.skip;
  }

  if (request.take != null) {
    searchParams.take = request.take;
  }

  return searchParams;
};

exports.buildPublicEventSearch = function(msearchBuilder, searchParams) {
  let searchSourceFields = constants.SUMMARY_EVENT_SOURCE_FIELDS;

  if (searchParams.dateFrom && searchParams.dateTo) {
    searchSourceFields = constants.SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES;
  }

  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_EVENT_FULL,
      type: "doc"
    })
    .setSearchSkip(searchParams.skip)
    .setSearchTake(searchParams.take)
    .setSearchSource(searchParams.source || searchSourceFields)
    .setSearchSort([
      { _score: { order: "desc" } },
      { name_sort: { order: "asc" } }
    ]);

  const boolQuery = search.createQuery().createBoolQuery();

  // public always only see active events
  boolQuery.addFilter().setTerm({ status: "Active" });

  // term can match in event name or venue name
  if (searchParams.term) {
    boolQuery.setMinimumShouldMatch(1);
    boolQuery.addShould().setMatch({ name: searchParams.term });
    boolQuery.addShould().setMatch({ venueName: searchParams.term });
    boolQuery.addShould().setMatch({ summary: searchParams.term });
  }

  if (searchParams.area) {
    boolQuery.addFilter().setTerm({ area: searchParams.area });
  }

  if (searchParams.location) {
    boolQuery.addFilter().setGeoBoundingBox({
      type: "indexed",
      locationOptimized: {
        top_left: {
          lat: searchParams.location.north,
          lon: searchParams.location.west
        },
        bottom_right: {
          lat: searchParams.location.south,
          lon: searchParams.location.east
        }
      }
    });
  }

  if (
    searchParams.dateFrom ||
    searchParams.dateTo ||
    searchParams.timeFrom ||
    searchParams.timeTo
  ) {
    const nestedBoolQuery = boolQuery
      .addFilter()
      .createNestedQuery("dates")
      .createBoolQuery();

    if (searchParams.dateFrom) {
      nestedBoolQuery
        .addFilter()
        .setRange({ "dates.date": { gte: searchParams.dateFrom } });
    }

    if (searchParams.dateTo) {
      nestedBoolQuery
        .addFilter()
        .setRange({ "dates.date": { lte: searchParams.dateTo } });
    }

    if (searchParams.timeFrom) {
      nestedBoolQuery
        .addFilter()
        .setRange({ "dates.to": { gt: searchParams.timeFrom } });
    }

    if (searchParams.timeTo) {
      nestedBoolQuery
        .addFilter()
        .setRange({ "dates.from": { lte: searchParams.timeTo } });
    }
  }

  if (searchParams.artsType) {
    boolQuery.addFilter().setTerm({ artsType: searchParams.artsType });
  }

  if (searchParams.costType) {
    boolQuery.addFilter().setTerm({ costType: searchParams.costType });
  }

  if (searchParams.bookingType) {
    boolQuery.addFilter().setTerm({ bookingType: searchParams.bookingType });
  }

  if (searchParams.tags) {
    searchParams.tags.forEach(tag =>
      boolQuery.addFilter().setTerm({ tags: tag })
    );

    // do the following for an 'or' effect, rather than the above 'and':
    // boolQuery.addFilter().setTerms({ tags: searchParams.tags });
  }

  if (searchParams.audience) {
    const subBoolQuery = boolQuery
      .addFilter()
      .createQuery()
      .createBoolQuery();

    subBoolQuery.setMinimumShouldMatch(1);

    subBoolQuery.addShould().setTerm({ tags: searchParams.audience });

    const nestedSubBoolQuery = subBoolQuery
      .addShould()
      .createNestedQuery("dates")
      .createBoolQuery();

    nestedSubBoolQuery
      .addFilter()
      .setTerm({ "dates.tags": searchParams.audience });

    if (searchParams.dateFrom) {
      nestedSubBoolQuery
        .addFilter()
        .setRange({ "dates.date": { gte: searchParams.dateFrom } });
    }

    if (searchParams.dateTo) {
      nestedSubBoolQuery
        .addFilter()
        .setRange({ "dates.date": { lte: searchParams.dateTo } });
    }

    if (searchParams.timeFrom) {
      nestedSubBoolQuery
        .addFilter()
        .setRange({ "dates.to": { gt: searchParams.timeFrom } });
    }

    if (searchParams.timeTo) {
      nestedSubBoolQuery
        .addFilter()
        .setRange({ "dates.from": { lte: searchParams.timeTo } });
    }
  }

  // if (searchParams.bookingType) {
  //     boolQuery.addFilter().setTerm({ bookingType: searchParams.bookingType });
  // }

  if (searchParams.venueId) {
    boolQuery.addFilter().setTerm({ venueId: searchParams.venueId });
  }

  if (searchParams.talentId) {
    boolQuery.addFilter().setTerm({ talents: searchParams.talentId });
  }

  if (searchParams.eventSeriesId) {
    boolQuery
      .addFilter()
      .setTerm({ eventSeriesId: searchParams.eventSeriesId });
  }
};

exports.buildSuggestSearch = function(msearchBuilder, indexName, term) {
  const search = msearchBuilder
    .createSearch({ index: indexName, type: "doc" })
    .setSearchTake(0);

  search
    .createSuggest("autocomplete")
    .setSuggestText(term)
    .setSuggestCompletion({
      size: constants.AUTOCOMPLETE_MAX_RESULTS,
      field: "nameSuggest"
    });

  search
    .createSuggest("fuzzyAutocomplete")
    .setSuggestText(term)
    .setSuggestCompletion({
      size: constants.AUTOCOMPLETE_MAX_RESULTS,
      field: "nameSuggest",
      fuzzy: {}
    });
};

exports.buildTalentSearch = function(msearchBuilder, request, isPublic) {
  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_TALENT_FULL,
      type: "doc"
    })
    .setSearchSkip(request.skip)
    .setSearchTake(request.take)
    .setSearchSource(constants.SUMMARY_TALENT_SOURCE_FIELDS)
    .setSearchSort([
      { _score: { order: "desc" } },
      { lastName_sort: { order: "asc" } },
      { "firstNames.sort": { order: "asc" } }
    ]);

  const boolQuery = search.createQuery().createBoolQuery();

  // public always only see active entities
  if (isPublic) {
    boolQuery.addFilter().setTerm({ status: "Active" });
  }

  if (request.term) {
    boolQuery.addMust().setMultiMatch({
      query: request.term,
      type: "cross_fields",
      operator: "or",
      fields: ["firstNames", "lastName"]
    });
  }
};

exports.buildVenueSearch = function(msearchBuilder, request, isPublic) {
  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_VENUE_FULL,
      type: "doc"
    })
    .setSearchSkip(request.skip)
    .setSearchTake(request.take)
    .setSearchSource(constants.SUMMARY_VENUE_SOURCE_FIELDS)
    .setSearchSort([
      { _score: { order: "desc" } },
      { name_sort: { order: "asc" } }
    ]);

  const boolQuery = search.createQuery().createBoolQuery();

  if (request.term) {
    boolQuery.addMust().setMatch({ name: request.term });
  }

  // public always only see active entities
  if (isPublic) {
    boolQuery.addFilter().setTerm({ status: "Active" });
  }

  if (request.location) {
    boolQuery.addFilter().setGeoBoundingBox({
      type: "indexed",
      locationOptimized: {
        top_left: {
          lat: request.location.north,
          lon: request.location.west
        },
        bottom_right: {
          lat: request.location.south,
          lon: request.location.east
        }
      }
    });
  }
};

exports.buildEventSeriesSearch = function(msearchBuilder, request, isPublic) {
  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
      type: "doc"
    })
    .setSearchSkip(request.skip)
    .setSearchTake(request.take)
    .setSearchSource(constants.SUMMARY_EVENT_SERIES_SOURCE_FIELDS)
    .setSearchSort([
      { _score: { order: "desc" } },
      { name_sort: { order: "asc" } }
    ]);

  const boolQuery = search.createQuery().createBoolQuery();

  // public always only see active entities
  if (isPublic) {
    boolQuery.addFilter().setTerm({ status: "Active" });
  }

  if (request.term) {
    boolQuery.addMust().setMatch({ name: request.term });
  }
};

exports.buildEventSearch = function(msearchBuilder, request, isPublic) {
  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_EVENT_FULL,
      type: "doc"
    })
    .setSearchSkip(request.skip)
    .setSearchTake(request.take)
    .setSearchSource(constants.SUMMARY_EVENT_SOURCE_FIELDS)
    .setSearchSort([
      { _score: { order: "desc" } },
      { name_sort: { order: "asc" } }
    ]);

  const boolQuery = search.createQuery().createBoolQuery();

  // public always only see active entities
  if (isPublic) {
    boolQuery.addFilter().setTerm({ status: "Active" });
  }

  if (request.term) {
    boolQuery.setMinimumShouldMatch(1);
    boolQuery.addShould().setMatch({ name: request.term });
    boolQuery.addShould().setMatch({ venueName: request.term });
    boolQuery.addShould().setMatch({ summary: request.term });
  }
};
