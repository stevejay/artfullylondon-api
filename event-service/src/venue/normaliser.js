import normalise from "normalise-request";
import * as entityNormaliser from "../entity/normaliser";

normalise.normalisers.address = addressNormaliser;
import addressNormaliser from "./address-normaliser";

const VENUE_NORMALISER = {
  name: entityNormaliser.NAME_NORMALISER,
  address: {
    trim: true,
    address: true,
  },
  postcode: {
    toUpperCase: true,
    collapseWhitespace: true,
    trim: true,
  },
  email: {
    trim: true,
    undefinedIfEmpty: true,
  },
  telephone: {
    replace: { pattern: /[-()]/g, newSubStr: ' ' },
    collapseWhitespace: true,
    trim: true,
    undefinedIfEmpty: true,
  },
  description: entityNormaliser.DESCRIPTION_NORMALISER,
  descriptionCredit: entityNormaliser.DESCRIPTION_CREDIT_NORMALISER,
  openingTimes: {
    undefinedIfEmpty: true,
  },
  additionalOpeningTimes: {
    undefinedIfEmpty: true,
  },
  openingTimesClosures: {
    undefinedIfEmpty: true,
  },
  namedClosures: {
    undefinedIfEmpty: true,
  },
  links: entityNormaliser.LINKS_NORMALISER,
  images: entityNormaliser.IMAGES_NORMALISER
  weSay: entityNormaliser.WE_SAY_NORMALISER,
  notes: entityNormaliser.NOTES_NORMALISER
};

export function normaliseCreateOrUpdateVenueRequest(request) {
  return normalise({ ...request }, VENUE_NORMALISER);
}
