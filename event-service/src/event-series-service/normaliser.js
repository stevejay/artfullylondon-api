import normalise from "normalise-request";
import {
  STRING_NORMALISER,
  LINKS_NORMALISER,
  IMAGES_NORMALISER
} from "../entity/normaliser";

const EVENT_SERIES_NORMALISER = {
  name: STRING_NORMALISER,
  summary: STRING_NORMALISER,
  description: STRING_NORMALISER,
  descriptionCredit: STRING_NORMALISER,
  occurrence: STRING_NORMALISER,
  links: LINKS_NORMALISER,
  images: IMAGES_NORMALISER,
  weSay: STRING_NORMALISER,
  notes: STRING_NORMALISER
};

export function normaliseCreateOrUpdateEventSeriesRequest(request) {
  return normalise({ ...request }, EVENT_SERIES_NORMALISER);
}
