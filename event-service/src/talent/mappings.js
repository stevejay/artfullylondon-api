'use strict';

const simplify = require('es-simplify');
const constants = require('./constants');
const globalConstants = require('../constants');
const mappings = require('../data/mappings');
const date = require('../date');

exports.mapRequestToDbItem = (id, request, description) => {
  const dateToday = date.getTodayAsStringDate();

  const result = {
    id: id,
    status: request.status,
    lastName: request.lastName,
    talentType: request.talentType,
    commonRole: request.commonRole,
    schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
    version: request.version,
    createdDate: request.createdDate || dateToday,
    updatedDate: dateToday,
  };

  const isIndividual = _isIndividualTalent(request.talentType);

  if (isIndividual && request.firstNames) {
    result.firstNames = request.firstNames;
  }

  if (description.content) {
    result.description = description.content;
  }
  if (description.credit) {
    result.descriptionCredit = description.credit;
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
    entityType: globalConstants.ENTITY_TYPE_TALENT,
    id: dbItem.id,
    status: dbItem.status,
    lastName: dbItem.lastName,
    talentType: dbItem.talentType,
    commonRole: dbItem.commonRole,
  };

  if (dbItem.firstNames) {
    result.firstNames = dbItem.firstNames;
  }

  mappings.mapMainImage(dbItem.images, result);

  return result;
};

exports.mapDbItemToPublicResponse = dbItem => {
  const result = exports.mapDbItemToPublicSummaryResponse(dbItem);

  if (dbItem.description) {
    result.description = dbItem.description;
  }
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
  result.lastName_sort = mappings.mapNameToSortName(dbItem.lastName);
  result.version = dbItem.version;
  return result;
};

exports.mapDbItemToAutocompleteSearchIndex = dbItem => {
  const fullName = _createFullName(dbItem);
  const simplifiedFullName = simplify(fullName);

  const lastName = dbItem.lastName;
  const simplifiedLastName = simplify(lastName);

  const noCommonStartWordsSimplifiedLastName = _isIndividualTalent(
    dbItem.talentType
  )
    ? null
    : mappings.removeCommonStartWords(simplifiedLastName);

  const result = {
    nameSuggest: [simplifiedFullName],
    output: fullName,
    entityType: globalConstants.ENTITY_TYPE_TALENT,
    id: dbItem.id,
    status: dbItem.status,
    talentType: dbItem.talentType,
    commonRole: dbItem.commonRole,
    version: dbItem.version,
  };

  if (simplifiedLastName && simplifiedLastName !== simplifiedFullName) {
    result.nameSuggest.push(simplifiedLastName);
  }

  if (
    noCommonStartWordsSimplifiedLastName &&
    noCommonStartWordsSimplifiedLastName !== simplifiedLastName
  ) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedLastName);
  }

  return result;
};

function _createFullName(response) {
  return response.firstNames
    ? response.firstNames + ' ' + response.lastName
    : response.lastName;
}

function _isIndividualTalent(talentType) {
  return talentType === constants.TALENT_TYPE_INDIVIDUAL;
}
