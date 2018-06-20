import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as talentType from "../types/talent-type";
import * as entityType from "../types/entity-type";
import * as identity from "../entity/id";

export const CURRENT_TALENT_SCHEME_VERSION = 2;

export const mapCreateOrUpdateTalentRequest = mappr.compose(
  params => ({
    id: params.id || identity.createIdFromTalentData(params),
    schemeVersion: CURRENT_TALENT_SCHEME_VERSION,
    firstNames:
      params.talentType === talentType.INDIVIDUAL && params.firstNames
        ? params.firstNames
        : undefined
  }),
  fpPick([
    "status",
    "lastName",
    "talentType",
    "commonRole",
    "version",
    "weSay",
    "description",
    "descriptionCredit"
  ]),
  entityMapper.mapEntityEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages
);

export const mapToPublicSummaryResponse = mappr.compose(
  () => ({ entityType: entityType.TALENT }),
  fpPick([
    "id",
    "status",
    "firstNames",
    "lastName",
    "talentType",
    "commonRole"
  ]),
  entityMapper.mapResponseMainImage
);

export const mapToPublicFullResponse = mappr.compose(
  mapToPublicSummaryResponse,
  fpPick(["description", "descriptionCredit", "weSay", "links", "images"]),
  () => ({ isFullEntity: true })
);
