import { ensure } from "ensure-request";
import { REQUIRED_ENUM } from "../entity/validator";
import * as entityType from "../types/entity-type";

const REFRESH_SEARCH_INDEX_VALIDATOR = {
  entityType: REQUIRED_ENUM(entityType.ALLOWED_INDIVIDUAL_VALUES)
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateRefreshSearchIndexRequest(request) {
  ensure(request, REFRESH_SEARCH_INDEX_VALIDATOR, errorHandler);
}
