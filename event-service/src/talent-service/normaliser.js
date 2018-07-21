import normalise from "../normalise";
import {
  STRING_NORMALISER,
  HTML_NORMALISER,
  LINKS_NORMALISER,
  IMAGES_NORMALISER
} from "../entity/normaliser";

const TALENT_NORMALISER = {
  firstNames: STRING_NORMALISER,
  lastName: STRING_NORMALISER,
  commonRole: STRING_NORMALISER,
  description: HTML_NORMALISER,
  descriptionCredit: STRING_NORMALISER,
  links: LINKS_NORMALISER,
  images: IMAGES_NORMALISER,
  weSay: STRING_NORMALISER,
  notes: STRING_NORMALISER
};

export function normaliseCreateOrUpdateTalentRequest(request) {
  return normalise({ ...request }, TALENT_NORMALISER);
}
