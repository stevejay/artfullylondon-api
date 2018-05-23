'use strict';

const venueConstants = require('./constants');

const CENTRAL_AREA_REGEX = /^(?:SW7|SW3|SW1[A-Z]|W1|W1[A-Z]|W2|W9|NW8|NW1|N1C|N1|WC.+|EC.+|SE1|SE11|E1W|E2|E1)$/;
const WEST_AREA_REGEX = /^(?:W\d+|UB.+|SL.+)$/;
const NORTH_AREA_REGEX = /^(?:N\d+|EN.+|AL.+)$/;
const NORTH_WEST_AREA_REGEX = /^(?:NW\d+|HA.+|WD.+|HP.+)$/;
const EAST_AREA_REGEX = /^(?:E\d+|IG.+|RM.+|CM.+)$/;
const SOUTH_EAST_AREA_REGEX = /^(?:SE\d+|CR.+|BR.+|DA.+|TN.+)$/;
const SOUTH_WEST_AREA_REGEX = /^(?:SW\d+|TW.+|KT.+|SM.+)$/;

exports.getLondonArea = postcodeDistrict => {
  if (CENTRAL_AREA_REGEX.test(postcodeDistrict)) {
    return venueConstants.LOCATION_AREA_TYPE_CENTRAL;
  }

  if (WEST_AREA_REGEX.test(postcodeDistrict)) {
    return venueConstants.LOCATION_AREA_TYPE_WEST;
  }

  if (
    NORTH_AREA_REGEX.test(postcodeDistrict) ||
    NORTH_WEST_AREA_REGEX.test(postcodeDistrict)
  ) {
    return venueConstants.LOCATION_AREA_TYPE_NORTH;
  }

  if (EAST_AREA_REGEX.test(postcodeDistrict)) {
    return venueConstants.LOCATION_AREA_TYPE_EAST;
  }

  if (SOUTH_EAST_AREA_REGEX.test(postcodeDistrict)) {
    return venueConstants.LOCATION_AREA_TYPE_SOUTH_EAST;
  }

  if (SOUTH_WEST_AREA_REGEX.test(postcodeDistrict)) {
    return venueConstants.LOCATION_AREA_TYPE_SOUTH_WEST;
  }

  throw new Error(`postcodeDistrict value not matched: ${postcodeDistrict}`);
};
