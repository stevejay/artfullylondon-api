import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as eventSeriesType from "../types/event-series-type";

const EVENT_SERIES_CONSTRAINT = {
  status: entityValidator.STATUS_VALIDATOR,
  name: entityValidator.REQUIRED_NAME_CONSTRAINT,
  eventSeriesType: {
    presence: true,
    inclusion: eventSeriesType.ALLOWED_VALUES
  },
  occurrence: entityValidator.REQUIRED_ADDITIONAL_INFO_CONSTRAINT,
  summary: entityValidator.SUMMARY_CONSTRAINT,
  description: entityValidator.DESCRIPTION_CONSTRAINT,
  descriptionCredit: entityValidator.OPTIONAL_ADDITIONAL_INFO_CONSTRAINT,
  links: entityValidator.LINKS_CONSTRAINT,
  images: entityValidator.IMAGES_CONSTRAINT,
  weSay: entityValidator.WE_SAY_CONSTRAINT,
  version: entityValidator.VERSION_CONSTRAINT,
  createdDate: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  updatedDate: entityValidator.OPTIONAL_DATE_CONSTRAINT
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateEventSeriesRequest(request) {
  ensure(request, EVENT_SERIES_CONSTRAINT, errorHandler);
}
