import _ from "lodash";
import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as venueType from "../types/venue-type";
import * as wheelchairAccessType from "../types/wheelchair-access-type";
import * as disabledBathroomType from "../types/disabled-bathroom-type";
import * as hearingFacilitiesType from "../types/hearing-facilities-type";
import * as namedClosureType from "../types/named-closure-type";

const LONDON_LAT = 51.5074;
const LONDON_LAT_RANGE = 0.3;
const LONDON_LNG = 0.1278;
const LONDON_LNG_RANGE = 0.6;

const VENUE_CONSTRAINT = {
  status: entityValidator.STATUS_VALIDATOR,
  name: entityValidator.REQUIRED_NAME_CONSTRAINT,
  venueType: {
    string: true,
    presence: true,
    inclusion: venueType.ALLOWED_VALUES
  },
  description: entityValidator.DESCRIPTION_CONSTRAINT,
  descriptionCredit: entityValidator.OPTIONAL_ADDITIONAL_INFO_CONSTRAINT,
  address: {
    string: true,
    presence: true,
    length: { minimum: 1, maximum: 400 }
  },
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
  wheelchairAccessType: {
    string: true,
    presence: true,
    inclusion: wheelchairAccessType.ALLOWED_VALUES
  },
  disabledBathroomType: {
    string: true,
    presence: true,
    inclusion: disabledBathroomType.ALLOWED_VALUES
  },
  hearingFacilitiesType: {
    string: true,
    presence: true,
    inclusion: hearingFacilitiesType.ALLOWED_VALUES
  },
  email: {
    email: true,
    length: { maximum: 100 }
  },
  telephone: {
    string: true,
    format: /^\d[\d\s-]{6,18}\d$/
  },
  openingTimes: entityValidator.OPENING_TIMES_CONSTRAINT,
  additionalOpeningTimes: entityValidator.ADDITIONAL_OPENING_TIMES_CONSTRAINT,
  openingTimesClosures: entityValidator.OPENING_TIMES_CLOSURES_CONSTRAINT,
  namedClosures: {
    array: true,
    length: {
      maximum: namedClosureType.ALLOWED_VALUES.length
    },
    each: {
      string: true,
      inclusion: namedClosureType.ALLOWED_VALUES
    }
  },
  links: entityValidator.LINKS_CONSTRAINT,
  images: entityValidator.IMAGES_CONSTRAINT,
  weSay: entityValidator.WE_SAY_CONSTRAINT,
  hasPermanentCollection: {
    presence: true,
    bool: true
  },
  notes: entityValidator.NOTES_CONSTRAINT,
  version: entityValidator.VERSION_CONSTRAINT,
  createdDate: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  updatedDate: entityValidator.OPTIONAL_DATE_CONSTRAINT
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateVenueRequest(request) {
  ensure(request, VENUE_CONSTRAINT, errorHandler);
}
