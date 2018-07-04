import _ from "lodash";
import { ensure } from "ensure-request";
import {
  REQUIRED_ENUM,
  OPTIONAL_DATE,
  OPTIONAL_STRING,
  OPTIONAL_LONG_STRING,
  REQUIRED_STRING,
  REQUIRED_VERSION,
  LINKS,
  IMAGES
} from "../entity/validator";
import * as talentType from "../types/talent-type";
import * as statusType from "../types/status-type";

const TALENT_VALIDATOR = {
  status: REQUIRED_ENUM(statusType.ALLOWED_VALUES),
  talentType: {
    ...REQUIRED_ENUM(talentType.ALLOWED_VALUES),
    dependency: {
      test: value => value === talentType.GROUP,
      ensure: (__, attrs) => _.isNil(attrs.firstNames),
      message: "first names should be blank for group talent"
    }
  },
  firstNames: OPTIONAL_STRING,
  lastName: REQUIRED_STRING,
  commonRole: REQUIRED_STRING,
  description: OPTIONAL_LONG_STRING,
  descriptionCredit: OPTIONAL_STRING,
  links: LINKS,
  images: IMAGES,
  weSay: OPTIONAL_STRING,
  notes: OPTIONAL_STRING,
  version: REQUIRED_VERSION,
  createdDate: OPTIONAL_DATE
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateTalentRequest(request) {
  ensure(request, TALENT_VALIDATOR, errorHandler);
}
