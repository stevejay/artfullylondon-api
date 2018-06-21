import _ from "lodash";
import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as talentType from "../types/talent-type";

const TALENT_CONSTRAINT = {
  status: entityValidator.STATUS_VALIDATOR,
  talentType: {
    presence: true,
    inclusion: talentType.ALLOWED_VALUES,
    dependency: {
      test: value => value === talentType.GROUP,
      ensure: (__, attrs) => _.isNil(attrs.firstNames),
      message: "first names should be blank for group talent"
    }
  },
  firstNames: entityValidator.OPTIONAL_NAME_CONSTRAINT,
  lastName: entityValidator.REQUIRED_NAME_CONSTRAINT,
  commonRole: entityValidator.REQUIRED_ADDITIONAL_INFO_CONSTRAINT,
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

export function validateCreateOrUpdateTalentRequest(request) {
  ensure(request, TALENT_CONSTRAINT, errorHandler);
}
