import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as idGenerator from "../entity/id-generator";
import * as entityType from "../types/entity-type";

export const CURRENT_EVENT_SERIES_SCHEME_VERSION = 1;

export const mapCreateOrUpdateEventSeriesRequest = mappr.compose(
  params => ({
    id: params.id || idGenerator.generateFromName(params.name),
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
    "weSay",
    "notes"
  ]),
  entityMapper.mapRequestEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages
);

export const mapResponse = mappr.compose(
  () => ({ entityType: entityType.EVENT_SERIES }),
  fpPick([
    "id",
    "status",
    "name",
    "eventSeriesType",
    "occurrence",
    "summary",
    "description",
    "descriptionCredit",
    "weSay",
    "notes",
    "links",
    "images",
    "version",
    "schemeVersion",
    "createdDate",
    "updatedDate"
  ]),
  entityMapper.mapResponseMainImage
);
