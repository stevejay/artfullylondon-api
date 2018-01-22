'use strict';

const simplify = require('es-simplify');
const constants = require('./constants');
const globalConstants = require('../constants');
const globalMappings = require('../data/mappings');

exports.mapRequestToDbItem = (id, request, description) => {
  const result = {
    id: id,
    status: request.status,
    name: request.name,
    venueType: request.venueType,
    address: request.address,
    postcode: request.postcode,
    latitude: request.latitude,
    longitude: request.longitude,
    wheelchairAccessType: request.wheelchairAccessType,
    disabledBathroomType: request.disabledBathroomType,
    hearingFacilitiesType: request.hearingFacilitiesType,
    schemeVersion: constants.CURRENT_VENUE_SCHEME_VERSION,
    version: request.version,
    createdDate: request.createdDate,
    updatedDate: request.updatedDate,
    hasPermanentCollection: request.hasPermanentCollection,
  };

  if (description.content) {
    result.description = description.content;
  }
  if (description.credit) {
    result.descriptionCredit = description.credit;
  }
  if (request.email) {
    result.email = request.email;
  }
  if (request.telephone) {
    result.telephone = request.telephone;
  }
  if (request.weSay) {
    result.weSay = request.weSay;
  }
  if (request.notes) {
    result.notes = request.notes;
  }

  globalMappings.mapRequestOpeningTimesToDbItem(request.openingTimes, result);
  globalMappings.mapRequestAdditionalOpeningTimesToDbItem(
    request.additionalOpeningTimes,
    result
  );
  globalMappings.mapRequestOpeningTimesClosuresToDbItem(
    request.openingTimesClosures,
    result
  );
  globalMappings.mapRequestNamedClosuresToDbItem(request.namedClosures, result);
  globalMappings.mapRequestLinksToDbItem(request.links, result);
  globalMappings.mapRequestImagesToDbItem(request.images, result);

  return result;
};

exports.mapDbItemToAdminResponse = dbItem => {
  _fixUpClosures(dbItem);
  dbItem.hasPermanentCollection = !!dbItem.hasPermanentCollection;
  return dbItem;
};

exports.mapDbItemToPublicSummaryResponse = dbItem => {
  const result = {
    entityType: globalConstants.ENTITY_TYPE_VENUE,
    id: dbItem.id,
    status: dbItem.status,
    name: dbItem.name,
    venueType: dbItem.venueType,
    address: dbItem.address,
    postcode: dbItem.postcode,
    latitude: dbItem.latitude,
    longitude: dbItem.longitude,
  };

  globalMappings.mapMainImage(dbItem.images, result);

  return result;
};

exports.mapDbItemToPublicResponse = dbItem => {
  _fixUpClosures(dbItem);
  const result = exports.mapDbItemToPublicSummaryResponse(dbItem);

  result.wheelchairAccessType = dbItem.wheelchairAccessType;
  result.disabledBathroomType = dbItem.disabledBathroomType;
  result.hearingFacilitiesType = dbItem.hearingFacilitiesType;
  result.hasPermanentCollection = !!dbItem.hasPermanentCollection;

  if (dbItem.description) {
    result.description = dbItem.description;
  }
  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.email) {
    result.email = dbItem.email;
  }
  if (dbItem.telephone) {
    result.telephone = dbItem.telephone;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (dbItem.notes) {
    result.notes = dbItem.notes;
  }

  if (dbItem.openingTimes) {
    result.openingTimes = dbItem.openingTimes;
  }
  if (dbItem.additionalOpeningTimes) {
    result.additionalOpeningTimes = dbItem.additionalOpeningTimes;
  }
  if (dbItem.openingTimesClosures) {
    result.openingTimesClosures = dbItem.openingTimesClosures;
  }
  if (dbItem.namedClosures) {
    result.namedClosures = dbItem.namedClosures;
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

  result.name_sort = globalMappings.mapNameToSortName(result.name);
  result.version = dbItem.version;

  result.locationOptimized = {
    lat: result.latitude,
    lon: result.longitude,
  };

  return result;
};

exports.mapDbItemToAutocompleteSearchIndex = dbItem => {
  const name = dbItem.name;
  const simplifiedName = simplify(name);

  const noCommonStartWordsSimplifiedName = globalMappings.removeCommonStartWords(
    simplifiedName
  );

  const result = {
    nameSuggest: [simplifiedName],
    output: name,
    entityType: globalConstants.ENTITY_TYPE_VENUE,
    id: dbItem.id,
    status: dbItem.status,
    venueType: dbItem.venueType,
    address: dbItem.address,
    postcode: dbItem.postcode,
    version: dbItem.version,
  };

  if (noCommonStartWordsSimplifiedName !== simplifiedName) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedName);
  }

  return result;
};

function _fixUpClosures(obj) {
  if (obj.closures && obj.closures.length) {
    obj.openingTimesClosures = obj.closures.map(closure => ({ date: closure }));
    delete obj.closures;
  }
}
