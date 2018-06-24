import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as talentType from "../types/talent-type";
import * as entityType from "../types/entity-type";
import * as idGenerator from "../entity/id-generator";

export const CURRENT_TALENT_SCHEME_VERSION = 2;

export const mapCreateOrUpdateTalentRequest = mappr.compose(
  params => ({
    id: params.id || idGenerator.generateFromTalent(params),
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
  entityMapper.mapRequestEditDates,
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
  fpPick([
    "description",
    "descriptionCredit",
    "weSay",
    "links",
    "images",
    "version"
  ]),
  () => ({ isFullEntity: true })
);
