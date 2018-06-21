import normalise from "normalise-request";
import {
  STRING_NORMALISER,
  BASIC_ARRAY_NORMALISER,
  LINKS_NORMALISER,
  IMAGES_NORMALISER
} from "../entity/normaliser";

normalise.normalisers.address = addressNormaliser;
import addressNormaliser from "./address-normaliser";

const VENUE_NORMALISER = {
  name: STRING_NORMALISER,
  address: { ...STRING_NORMALISER, address: true },
  postcode: {
    toUpperCase: true,
    collapseWhitespace: true,
    ...STRING_NORMALISER
  },
  email: STRING_NORMALISER,
  telephone: {
    replace: { pattern: /[-()]/g, newSubStr: " " },
    collapseWhitespace: true,
    ...STRING_NORMALISER
  },
  description: STRING_NORMALISER,
  descriptionCredit: STRING_NORMALISER,
  openingTimes: BASIC_ARRAY_NORMALISER,
  additionalOpeningTimes: BASIC_ARRAY_NORMALISER,
  openingTimesClosures: BASIC_ARRAY_NORMALISER,
  namedClosures: BASIC_ARRAY_NORMALISER,
  links: LINKS_NORMALISER,
  images: IMAGES_NORMALISER,
  weSay: STRING_NORMALISER,
  notes: STRING_NORMALISER
};

export function normaliseCreateOrUpdateVenueRequest(request) {
  return normalise({ ...request }, VENUE_NORMALISER);
}
