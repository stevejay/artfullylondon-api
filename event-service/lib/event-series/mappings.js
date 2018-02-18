'use strict';

const simplify = require('es-simplify');
const constants = require('./constants');
const globalConstants = require('../constants');
const mappings = require('../data/mappings');
const date = require('../date');

exports.mapRequestToDbItem = (id, request) => {
  const dateToday = date.getTodayAsStringDate();

  const result = {
    id: id,
    status: request.status,
    name: request.name,
    eventSeriesType: request.eventSeriesType,
    occurrence: request.occurrence,
    summary: request.summary,
    description: request.description,
    schemeVersion: constants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
    version: request.version,
    createdDate: request.createdDate || dateToday,
    updatedDate: dateToday,
  };

  if (request.descriptionCredit) {
    result.descriptionCredit = request.descriptionCredit;
  }
  if (request.weSay) {
    result.weSay = request.weSay;
  }

  mappings.mapRequestLinksToDbItem(request.links, result);
  mappings.mapRequestImagesToDbItem(request.images, result);

  return result;
};

exports.mapDbItemToAdminResponse = dbItem => {
  return dbItem;
};

exports.mapDbItemToPublicSummaryResponse = dbItem => {
  const result = {
    entityType: globalConstants.ENTITY_TYPE_EVENT_SERIES,
    id: dbItem.id,
    status: dbItem.status,
    name: dbItem.name,
    eventSeriesType: dbItem.eventSeriesType,
    occurrence: dbItem.occurrence,
    summary: dbItem.summary,
  };

  mappings.mapMainImage(dbItem.images, result);

  return result;
};

exports.mapDbItemToPublicResponse = dbItem => {
  const result = exports.mapDbItemToPublicSummaryResponse(dbItem);

  result.description = dbItem.description;

  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (dbItem.links) {
    result.links = dbItem.links;
  }
  if (dbItem.images) {
    result.images = dbItem.images;
  }

  return result;
};

exports.mapDbItemToFullSearchIndex = dbItem => {
  const result = exports.mapDbItemToPublicSummaryResponse(dbItem);
  result.name_sort = mappings.mapNameToSortName(dbItem.name);
  result.version = dbItem.version;
  return result;
};

exports.mapDbItemToAutocompleteSearchIndex = dbItem => {
  const name = dbItem.name;
  const simplifiedName = simplify(name);
  const noCommonStartWordsSimplifiedName = mappings.removeCommonStartWords(
    simplifiedName
  );

  const result = {
    nameSuggest: [simplifiedName],
    output: `${name} (Event Series)`,
    entityType: 'event-series',
    id: dbItem.id,
    status: dbItem.status,
    version: dbItem.version,
  };

  if (noCommonStartWordsSimplifiedName !== simplifiedName) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedName);
  }

  return result;
};
