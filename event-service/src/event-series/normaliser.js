import normalise from "normalise-request";
import * as entityNormaliser from "../entity/normaliser";

const EVENT_SERIES_NORMALISER = {
  name: entityNormaliser.NAME_NORMALISER,
  summary: entityNormaliser.SUMMARY_NORMALISER,
  description: entityNormaliser.DESCRIPTION_NORMALISER,
  descriptionCredit: entityNormaliser.DESCRIPTION_CREDIT_NORMALISER,
  occurrence: { trim: true },
  links: entityNormaliser.LINKS_NORMALISER,
  images: entityNormaliser.IMAGES_NORMALISER,
  weSay: entityNormaliser.WE_SAY_NORMALISER
};

export function normaliseCreateOrUpdateEventSeriesRequest(request) {
  return normalise({ ...request }, EVENT_SERIES_NORMALISER);
}
