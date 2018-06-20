import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as identity from "../entity/id";
import * as entityType from "../types/entity-type";

export const CURRENT_VENUE_SCHEME_VERSION = 4;

export const mapCreateOrUpdateVenueRequest = mappr.compose(
  params => ({
    id: params.id || identity.createIdFromName(params.name),
    schemeVersion: CURRENT_VENUE_SCHEME_VERSION
  }),
  fpPick([
    "status",
    "name",
    "venueType",
    "address",
    "postcode",
    "latitude",
    "longitude",
    "email",
    "telephone",
    "wheelchairAccessType",
    "disabledBathroomType",
    "hearingFacilitiesType",
    "hasPermanentCollection",
    "version",
    "weSay",
    "notes",
    "description",
    "descriptionCredit"
  ]),
  entityMapper.mapEntityEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages,
  {
    openingTimes: entityMapper.mapOpeningTimes,
    additionalOpeningTimes: entityMapper.mapAdditionalOpeningTimes,
    openingTimesClosures: entityMapper.mapOpeningTimesClosures,
    namedClosures: entityMapper.mapNamedClosures
  }
);

export const mapToAdminResponse = venue => ({
  ...venue,
  hasPermanentCollection: !!venue.hasPermanentCollection
});

export const mapToPublicSummaryResponse = mappr.compose(
  { entityType: () => entityType.VENUE },
  fpPick([
    "id",
    "status",
    "name",
    "venueType",
    "address",
    "postcode",
    "latitude",
    "longitude"
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
    "wheelchairAccessType",
    "disabledBathroomType",
    "hearingFacilitiesType",
    "hasPermanentCollection",
    "email",
    "telephone",
    "notes",
    "openingTimes",
    "additionalOpeningTimes",
    "openingTimesClosures",
    "namedClosures"
  ]),
  { isFullEntity: true }
);
