import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as identity from "../entity/id";
import * as entityType from "../types/entity-type";

export const CURRENT_EVENT_SERIES_SCHEME_VERSION = 1;

export const mapCreateOrUpdateEventSeriesRequest = mappr.compose(
  params => ({
    id: params.id || identity.createIdFromName(params.name),
    schemeVersion: CURRENT_EVENT_SERIES_SCHEME_VERSION
  }),
  fpPick([
    "status",
    "name",
    "eventSeriesType",
    "occurrence",
    "summary",
    "version",
    "description",
    "descriptionCredit",
    "weSay"
  ]),
  entityMapper.mapRequestEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages
);

export const mapToPublicSummaryResponse = mappr.compose(
  () => ({ entityType: entityType.EVENT_SERIES }),
  fpPick(["id", "status", "name", "eventSeriesType", "occurrence", "summary"]),
  entityMapper.mapResponseMainImage
);

export const mapToPublicFullResponse = mappr.compose(
  mapToPublicSummaryResponse,
  fpPick(["description", "descriptionCredit", "weSay", "links", "images"]),
  () => ({ isFullEntity: true })
);
