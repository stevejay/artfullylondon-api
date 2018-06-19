import normalise from "normalise-request";
import * as entityNormaliser from "../entity/normaliser";

const TALENT_NORMALISER = {
  firstNames: {
    trim: true,
    undefinedIfEmpty: true
  },
  lastName: {
    trim: true
  },
  commonRole: {
    trim: true
  },
  description: entityNormaliser.DESCRIPTION_NORMALISER,
  descriptionCredit: entityNormaliser.DESCRIPTION_CREDIT_NORMALISER,
  links: entityNormaliser.LINKS_NORMALISER,
  images: entityNormaliser.IMAGES_NORMALISER,
  weSay: entityNormaliser.WE_SAY_NORMALISER
};

export function normaliseCreateOrUpdateTalentRequest(request) {
  return normalise({ ...request }, TALENT_NORMALISER);
}
