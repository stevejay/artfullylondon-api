import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as venueType from "../types/venue-type";
import * as wheelchairAccessType from "../types/wheelchair-access-type";
import * as disabledBathroomType from "../types/disabled-bathroom-type";
import * as hearingFacilitiesType from "../types/hearing-facilities-type";
import * as namedClosureType from "../types/named-closure-type";
import * as statusType from "../types/status-type";

const LONDON_LAT = 51.5074;
const LONDON_LAT_RANGE = 0.3;
const LONDON_LNG = 0.1278;
const LONDON_LNG_RANGE = 0.6;

const VENUE_VALIDATOR = {
  status: entityValidator.REQUIRED_ENUM(statusType.ALLOWED_VALUES),
  name: entityValidator.REQUIRED_STRING,
  venueType: entityValidator.REQUIRED_ENUM(venueType.ALLOWED_VALUES),
  description: entityValidator.OPTIONAL_LONG_STRING,
  descriptionCredit: entityValidator.OPTIONAL_STRING,
  address: entityValidator.REQUIRED_STRING,
  postcode: {
    string: true,
    presence: true,
    format: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s+[0-9][A-Z]{2}$/
  },
  latitude: {
    number: true,
    presence: true,
    numericality: {
      greaterThanOrEqualTo: LONDON_LAT - LONDON_LAT_RANGE,
      lessThanOrEqualTo: LONDON_LAT + LONDON_LAT_RANGE
    }
  },
  longitude: {
    number: true,
    presence: true,
    numericality: {
      greaterThanOrEqualTo: LONDON_LNG - LONDON_LNG_RANGE,
      lessThanOrEqualTo: LONDON_LNG + LONDON_LNG_RANGE
    }
  },
  wheelchairAccessType: entityValidator.REQUIRED_ENUM(
    wheelchairAccessType.ALLOWED_VALUES
  ),
  disabledBathroomType: entityValidator.REQUIRED_ENUM(
    disabledBathroomType.ALLOWED_VALUES
  ),
  hearingFacilitiesType: entityValidator.REQUIRED_ENUM(
    hearingFacilitiesType.ALLOWED_VALUES
  ),
  email: {
    email: true,
    length: { maximum: 100 }
  },
  telephone: {
    string: true,
    format: /^\d[\d\s-]{6,18}\d$/
  },
  openingTimes: entityValidator.OPENING_TIMES,
  additionalOpeningTimes: entityValidator.ADDITIONAL_OPENING_TIMES,
  openingTimesClosures: entityValidator.OPENING_TIMES_CLOSURES,
  namedClosures: {
    array: true,
    length: { maximum: namedClosureType.ALLOWED_VALUES.length },
    each: entityValidator.REQUIRED_ENUM(namedClosureType.ALLOWED_VALUES)
  },
  links: entityValidator.LINKS,
  images: entityValidator.IMAGES,
  weSay: entityValidator.OPTIONAL_STRING,
  notes: entityValidator.OPTIONAL_STRING,
  hasPermanentCollection: entityValidator.REQUIRED_BOOL,
  version: entityValidator.OPTIONAL_VERSION
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateVenueRequest(request) {
  ensure(request, VENUE_VALIDATOR, errorHandler);
}
