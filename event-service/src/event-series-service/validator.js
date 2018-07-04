import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as eventSeriesType from "../types/event-series-type";
import * as statusType from "../types/status-type";

const EVENT_SERIES_CONSTRAINT = {
  status: entityValidator.REQUIRED_ENUM(statusType.ALLOWED_VALUES),
  name: entityValidator.REQUIRED_STRING,
  eventSeriesType: entityValidator.REQUIRED_ENUM(
    eventSeriesType.ALLOWED_VALUES
  ),
  occurrence: entityValidator.REQUIRED_STRING,
  summary: entityValidator.REQUIRED_STRING,
  description: entityValidator.OPTIONAL_LONG_STRING,
  descriptionCredit: entityValidator.OPTIONAL_STRING,
  links: entityValidator.LINKS,
  images: entityValidator.IMAGES,
  weSay: entityValidator.OPTIONAL_STRING,
  version: entityValidator.REQUIRED_VERSION,
  createdDate: entityValidator.OPTIONAL_DATE
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateEventSeriesRequest(request) {
  ensure(request, EVENT_SERIES_CONSTRAINT, errorHandler);
}
